# Kodo — système de design

Kodo est un **juge**. On y lit un énoncé, on écrit un programme, et des tests le valident ou le font tomber. Tout le design part de là : la matière première de Kodo, ce sont des **cellules** — un problème, un test, un jour d'activité. Une case vide, une case réussie, une case ratée. Ce motif unique relie la grille du programme, la bande de tests du juge, le calendrier d'activité et la progression des élèves dans un groupe.

Direction : **studio** (outil de développeur précis, à la Linear / Vercel / Raycast), mais propre à Kodo. Sobre, dense, exact. Une seule couleur d'accent. Pas de décor.

## 1. Principes

1. **Le contenu réel avant le texte.** On montre un vrai énoncé, un vrai test raté, une vraie erreur expliquée, plutôt qu'une phrase qui les décrit.
2. **Une idée forte par écran.** Chaque page a un point focal (le prochain problème, le juge, la grille). Le reste est calme.
3. **Des lignes, pas des cartes.** On structure avec des filets (1px) et de l'espace. Un panneau (L1) n'existe que pour encadrer une liste, un tableau, un éditeur ou un objet qu'on manipule. Jamais deux panneaux identiques côte à côte « pour faire joli ».
4. **Les chiffres sont des données.** Points, temps en ms, tests passés : alignés, exacts, jamais arrondis pour l'effet.
5. **Rien qui ne serve à rien.** Si un élément n'aide pas à lire, comprendre ou agir, il part.

## 2. Couleurs

Neutres froids + un accent outremer. Vert / rouge / ambre réservés aux **verdicts** du juge.

| Jeton | Clair | Sombre | Rôle |
| --- | --- | --- | --- |
| `--bg` (L0) | `#fafafa` | `#0e0e11` | fond de page (~60 %) |
| `--surface` (L1) | `#ffffff` | `#16161a` | panneaux, tableaux, éditeur |
| `--surface-2` | `#f4f4f6` | `#1c1c21` | en-têtes de tableau, champs, cases vides |
| `--surface-3` | `#ebebef` | `#25252b` | piste des barres de progression |
| `--line` | `rgb(23 23 28 / 0.08)` | `rgb(255 255 255 / 0.08)` | filets |
| `--line-strong` | `rgb(23 23 28 / 0.16)` | `rgb(255 255 255 / 0.16)` | bords de champs au repos, séparateurs forts |
| `--ink` | `#17171c` | `#ededf1` | texte principal |
| `--ink-2` | `#4a4a55` | `#b9b9c4` | texte secondaire (≥ 7:1) |
| `--muted` | `#6e6e7a` | `#8b8b98` | méta (≥ 4.5:1 sur L0 et L1) |
| `--accent` | `#2f3cf0` | `#8a93ff` | actions primaires, focus, cases réussies, onglet actif |
| `--accent-soft` | `#eef0fe` | `#1d1f45` | ta ligne au classement, sélection |
| `--ok` / `--bad` / `--warn` | verdicts | | test réussi / raté / temps dépassé |

Règle 60-30-10 mesurée sur capture : l'accent ne dépasse jamais ~10 % de la surface visible. Pas d'aplat d'accent en fond de section.

Profondeur : filet d'abord. Ombre seulement pour ce qui flotte (menu, toast) : `0 4px 16px rgb(0 0 0 / 0.06)`. En sombre : liseré haut `inset 0 1px 0 rgb(255 255 255 / 0.04)` sur L1.

## 3. Typographie

- **Mona Sans** (variable, axes graisse et largeur) pour toute l'interface.
- **Monaspace Neon** uniquement pour ce qui est du code ou de la sortie de programme : éditeur, exemples d'entrée/sortie, sortie des tests, raccourcis clavier. Jamais pour des étiquettes décoratives.
- Graisses : 400 (texte), 500 (libellés, boutons, liens de nav), 600 (titres). Rien au-dessus.
- Titres d'affichage (accueil, en-têtes de page) : largeur `font-stretch: 112%`, `letter-spacing: -0.02em`. Le corps reste en largeur normale.
- Chiffres : proportionnels par défaut (`.num`) ; **tabulaires seulement dans les colonnes de tableaux** (`.tabular`).

| Rôle | Taille | Interligne |
| --- | --- | --- |
| Affichage (accueil) | 56 / 40 mobile | 1.05 |
| H1 page | 32 | 1.15 |
| H2 section | 24 | 1.2 |
| H3 | 18 | 1.3 |
| Corps | 16 | 1.55 |
| Secondaire | 14 | 1.5 |
| Méta | 12 | 1.4 (jamais en dessous) |

Lignes de texte : 65–75 caractères maximum.

## 4. Espacement, grille, rayons

- Grille de 8 (4 pour les micro-espacements). Jetons : 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Conteneur : 1200 px max, gouttières 24 px (16 px sous 640 px).
- Sections : 96 px entre sections sur l'accueil, 48 px dans l'application.
- Rayons hiérarchisés : **3 px** cellules, **6 px** boutons et champs, **8 px** panneaux, **12 px** seulement pour l'éditeur de l'accueil. Jamais le même rayon partout par défaut.

## 5. Composants

- **Cell** (`components/Cell.tsx`) : carré de 14 px (12 px dense, 20 px grand), rayon 3. États : `empty` (surface-2 + filet), `tried` (accent-soft + filet accent), `done` (accent plein), `pass` (ok), `fail` (bad), `slow` (warn), `running` (filet accent animé). Toujours avec un libellé accessible.
- **TestStrip** : rangée de Cell pour les tests d'une exécution + résumé « 12/13 · 4 ms ». C'est le visage du juge, partout où un programme est exécuté.
- **Panel** : L1, filet `--line`, rayon 8. En-tête optionnel (titre 14/500 + action à droite) séparé par un filet.
- **Table** : dans un Panel, en-tête `surface-2` en méta, lignes de 44–48 px, filets entre lignes, survol `surface-2`. Colonnes numériques à droite, tabulaires.
- **Button** : hauteurs 32 / 36 / 44, rayon 6, 500. Primaire = accent plein. Secondaire = surface + filet fort. Fantôme = texte. Libellé verbe d'abord et précis (« Ouvrir Places libres », « Soumettre », « Rejoindre le groupe »).
- **Tabs** : soulignement 2 px accent sous l'onglet actif, flèches gauche/droite au clavier.
- **PageHeader** : H1 + une phrase factuelle (pas de slogan) + actions à droite. Filet sous l'en-tête.
- **Stat** : libellé méta au-dessus, valeur 24/600 en chiffres proportionnels. Pas de grosse rangée de « KPI » décorative : une stat n'apparaît que si elle sert.
- **DifficultyMark** : quatre barres + le mot (Facile, Moyen, Difficile, Expert).

## 6. Mouvement

- 120–180 ms, `cubic-bezier(0.2, 0, 0, 1)`, sur couleur, bordure, opacité, transformée seulement.
- **Un seul moment orchestré** : le remplissage des cellules quand les tests s'exécutent (décalage de 40 ms par case). Rien d'autre ne s'anime tout seul.
- `prefers-reduced-motion` : aucun mouvement, changements instantanés.

## 7. Écriture

Kodo tutoie, parle simplement et ne vend rien. Chaque phrase doit apprendre quelque chose de **précis** à l'élève.

- **Concret, chiffré, vérifiable.** « 60 problèmes, de *Somme de deux nombres* à *Inversions* » plutôt que « des dizaines d'exercices variés ». « Python a 5 fois plus de temps que le C++ » plutôt que « adapté à chaque langage ».
- **Des noms, pas des adjectifs.** Titres de section = ce que contient la section (« Défi du jour », « Classement de la semaine », « Ta progression par chapitre »).
- **Interdits** : slogans et formules creuses (« Pour de vrai », « Apprends en t'amusant », « Rejoins l'aventure », « Comment ça marche », « Simple et puissant », « rien à installer », « Bienvenue ! », « Bonjour X »), points d'exclamation hors réussite, superlatifs, emoji.
- **Boutons** : verbe + objet. Jamais « OK », « Valider », « En savoir plus ».
- **États vides** : ce que c'est + pourquoi c'est vide + l'action (« Aucun élève pour l'instant. Donne le code D25972 à ta classe. »).
- **Erreurs** : ce qui s'est passé + comment s'en sortir, sans reproche.
- **FR / EN** : mêmes faits, mêmes chiffres, formulés naturellement dans chaque langue.

## 8. Pages (un motif par route)

| Route | Motif | Point focal |
| --- | --- | --- |
| `/` visiteur | Marketing (accueil) | le juge en direct : un programme faux à corriger |
| `/` connecté | Tableau de bord | le prochain problème |
| `/parcours` | Liste | la grille de 60 cellules, chapitres en lignes avec leurs cellules |
| `/parcours/:id` | Détail (cours) | le cours, problèmes du chapitre en colonne |
| `/probleme/:id` | Panneau double | énoncé / éditeur + bande de tests |
| `/problemes` | Liste | tableau filtrable |
| `/defi` | Détail | les 4 problèmes du jour |
| `/classements` | Liste | le tableau, ta ligne |
| `/profil/:pseudo` | Détail | points, ligue, grille personnelle |
| `/groupes`, `/groupes/:id` | Liste / Détail | membres et progression |
| `/connexion`, `/inscription` | Formulaire (auth) | le formulaire |
| `/compte` | Réglages | sections empilées |
| `/a-propos` | Référence | tableaux de règles (points, ligues, limites du juge) |

## 9. Contrôle avant livraison

- [ ] Capture claire + sombre, 1440 et 375 px, sans défilement horizontal de la page.
- [ ] Aucune phrase générique (voir §7) ; chaque texte cite un fait de Kodo.
- [ ] Au plus 3 graisses, rien sous 12 px, chiffres tabulaires uniquement en colonnes.
- [ ] Tableaux et listes dans un L1 avec filets.
- [ ] Accent ≤ 10 % de la surface ; pas de panneaux identiques alignés pour décorer.
- [ ] Focus visible, onglets au clavier, libellés sur tous les champs.
