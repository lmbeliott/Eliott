# Mise en ligne sur kodocode.fr (Cloudflare Pages + Supabase)

Le site est un site statique : Cloudflare Pages le sert, Supabase garde les comptes et les
résultats. Chaque push sur la branche publiée reconstruit et publie le site automatiquement
(`.github/workflows/pages.yml`) dès que les secrets Cloudflare existent.

## 1. Domaine dans Cloudflare (une fois)

1. Cloudflare → **Add a domain** → `kodocode.fr` (offre Free).
2. Chez le registrar où le domaine a été acheté, remplacer les serveurs DNS par les deux
   serveurs `*.ns.cloudflare.com` indiqués par Cloudflare. L'activation prend de quelques
   minutes à quelques heures.
3. **SSL/TLS** → *Edge Certificates* : activer **Always Use HTTPS**, *Minimum TLS Version* 1.2.

## 2. Publication automatique depuis GitHub (une fois)

1. Cloudflare → *My Profile* → **API Tokens** → *Create Token* → modèle
   « Edit Cloudflare Workers » ou jeton personnalisé avec la seule permission
   **Account → Cloudflare Pages → Edit**.
2. Noter l'**Account ID** (page d'accueil du compte Cloudflare, colonne de droite).
3. GitHub → dépôt → *Settings* → *Secrets and variables* → *Actions* → **New repository secret** :
   - `CLOUDFLARE_API_TOKEN` : le jeton ;
   - `CLOUDFLARE_ACCOUNT_ID` : l'identifiant du compte.
4. Relancer le workflow « Déployer sur GitHub Pages » (onglet *Actions* → *Run workflow*) :
   le projet Pages `kodo` est créé puis publié.
5. Cloudflare → *Workers & Pages* → `kodo` → **Custom domains** → ajouter `kodocode.fr`,
   puis `www.kodocode.fr`.
6. Rediriger `www` vers le domaine nu : *Rules* → **Redirect Rules** → modèle
   « Redirect from WWW to root ».

## 3. Anti-robot Turnstile (recommandé, gratuit)

L'ordre compte : le site doit envoyer le jeton **avant** que Supabase l'exige.

1. Cloudflare → **Turnstile** → *Add widget* : nom « Kodo », domaines `kodocode.fr` et
   `www.kodocode.fr`, mode *Managed*.
2. GitHub → *Settings* → *Secrets and variables* → *Actions* → onglet **Variables** →
   `TURNSTILE_SITE_KEY` = la *site key* (publique). Relancer le workflow.
3. Vérifier sur kodocode.fr/connexion que la case Cloudflare apparaît.
4. Supabase → *Authentication* → *Attack Protection* → **Enable CAPTCHA protection** →
   fournisseur *Cloudflare Turnstile* → coller la **secret key**. (Elle ne va jamais dans le
   dépôt.)

## 4. Compte administrateur

- Le rôle `admin` ne se donne qu'en base (aucun client ne peut l'écrire).
- Le panneau `kodocode.fr/admin` exige la **double authentification** : à la première visite,
  scanner le QR code avec une application (Google Authenticator, Authy, 1Password,
  Bitwarden…). Chaque fonction d'administration refuse une session sans second facteur,
  même appelée directement par l'API.
- Garder une copie du secret affiché sous le QR code (gestionnaire de mots de passe) : en cas
  de perte du téléphone, il faut sinon supprimer le facteur en base
  (`delete from auth.mfa_factors where user_id = …`).
- Toutes les actions (suspensions, suppressions, lecture de code…) sont dans l'onglet *Journal*.

## 5. Ce qui est déjà en place

- **En-têtes HTTP** (`public/_headers`) : CSP stricte (aucun script en ligne, WebAssembly
  autorisé pour Python et C++), HSTS, `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, cache permanent des fichiers hachés.
- **Supabase Auth** : URL du site `https://kodocode.fr`, redirections autorisées limitées à
  kodocode.fr, www.kodocode.fr, l'ancienne adresse GitHub Pages et `localhost`.
- **Base** : RLS sur toutes les tables, droits des clients réduits au strict nécessaire
  (plus de TRUNCATE ni d'écriture par défaut sur les nouvelles tables), suspension de compte
  (connexion bloquée, sessions fermées, écritures refusées, retrait des classements),
  journal d'administration privé.

## 6. Plus tard

- **E-mails** : Supabase n'envoie que quelques e-mails par heure sans serveur SMTP. Pour la
  confirmation d'adresse et « mot de passe oublié » à grande échelle, brancher un SMTP
  (Resend ou Brevo, offres gratuites) dans *Authentication* → *SMTP Settings*, avec une
  adresse `@kodocode.fr`, puis activer *Confirm email*.
- Une fois kodocode.fr en service, retirer l'adresse GitHub Pages des redirections Supabase.
