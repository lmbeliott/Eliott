import type { ReactNode } from 'react'
import { SiteFooter, SiteHeader } from './Landing'
import { BASE_PRICE, euros, INCLUDED_NORMAL, INCLUDED_PROMO, PROMO_MONTHS, quote, TIERS } from '../../lib/pricing'

function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-4 pb-24 pt-10 sm:px-6">
        <h1 className="display-md text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : {updated}</p>
        <div className="legal mt-10 space-y-8 text-base leading-relaxed text-ink-2 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-ink [&_ul]:mt-2 [&_ul]:space-y-1.5">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export function Terms() {
  const example = quote(15, false)
  return (
    <LegalLayout title="Conditions générales de vente et d'utilisation" updated="4 octobre 2026">
      <section>
        <h2>1. Objet</h2>
        <p>Les présentes conditions générales de vente (CGV) et d'utilisation (CGU) encadrent l'utilisation de l'application SaaS « SwimHub Connect », destinée à la gestion des emplois du temps, des diplômes et des remplacements pour les clubs de natation.</p>
      </section>
      <section>
        <h2>2. Accès au service (CGU)</h2>
        <p>Le service « SwimHub Connect » est accessible aux administrateurs de clubs et à leurs éducateurs. Chaque utilisateur est responsable de la confidentialité de ses identifiants. L'utilisateur s'engage à vérifier son adresse e-mail dans un délai d'un mois suivant son inscription (à défaut, le compte non vérifié sera automatiquement supprimé), à utiliser le service de manière loyale, à ne pas falsifier ses diplômes ou qualifications, et à honorer les remplacements qu'il s'est engagé à effectuer.</p>
      </section>
      <section>
        <h2>3. Architecture multi-clubs</h2>
        <p>Un même utilisateur peut rejoindre plusieurs clubs avec un seul compte. Les données et plannings restent strictement cloisonnés par club.</p>
      </section>
      <section>
        <h2>4. Tarification et modèle économique (CGV)</h2>
        <p>Le service est facturé mensuellement à l'entité morale (le club) souscrivant à l'abonnement. L'unité de facturation est l'« accès » (1 accès = 1 compte utilisateur actif rattaché au club).</p>
        <ul>
          <li><strong>Abonnement de base (Pack Starter) :</strong> le socle de l'abonnement est facturé au tarif fixe de <strong>{euros(BASE_PRICE)} par mois (TTC)</strong>.</li>
          <li><strong>Période promotionnelle :</strong> les {PROMO_MONTHS} premiers mois, ce socle inclut <strong>jusqu'à {INCLUDED_PROMO} accès</strong>.</li>
          <li><strong>Tarif normal :</strong> à compter du 7<sup>e</sup> mois, le socle de {euros(BASE_PRICE)} inclut <strong>{INCLUDED_NORMAL} accès</strong>.</li>
        </ul>
        <p className="mt-4">Facturation des accès supplémentaires (au-delà des accès inclus) :</p>
        <ul>
          {TIERS.map((t, i) => (
            <li key={t.from}><strong>Palier {i + 1} :</strong> {t.to === Infinity ? `à partir du ${t.from}e accès` : `du ${t.from}e au ${t.to}e accès`} : <strong>{euros(t.unit)}</strong> par accès supplémentaire et par mois.</li>
          ))}
        </ul>
        <p className="mt-4 text-base"><em>Exemple hors promotion pour un club de 15 accès :</em> {euros(BASE_PRICE)} (incluant 3 accès) {example.lines.map((l) => `+ (${l.count} × ${euros(l.unit)})`).join(' ')} = {euros(example.total)} par mois.</p>
      </section>
      <section>
        <h2>5. Facturation et paiement</h2>
        <p>Le paiement s'effectue par prélèvement automatique via notre prestataire de paiement sécurisé (Stripe). Le club est facturé mensuellement à la date d'anniversaire de sa souscription. Le nombre d'accès est calculé dynamiquement. Toute modification du nombre d'accès (ajout ou suppression) entraîne un ajustement automatique au prorata sur la facture suivante.</p>
      </section>
      <section>
        <h2>6. Résiliation</h2>
        <p>Le contrat est sans engagement de durée. Le club peut résilier son abonnement à tout moment depuis l'espace « Abonnement ». La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement au prorata du mois en cours n'est effectué en cas de résiliation anticipée.</p>
      </section>
      <section>
        <h2>7. Responsabilités</h2>
        <p>L'éditeur de « SwimHub Connect » s'engage à fournir un service accessible 24 h/24 et 7 j/7 mais ne saurait être tenu responsable des coupures liées à la maintenance ou à des cas de force majeure. Le club reste l'unique responsable de la vérification légale des diplômes et cartes professionnelles de ses éducateurs.</p>
      </section>
      <section>
        <h2>8. Litiges</h2>
        <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.</p>
      </section>
    </LegalLayout>
  )
}

export function Privacy() {
  return (
    <LegalLayout title="Politique de confidentialité (RGPD)" updated="4 octobre 2026">
      <p>Dans le cadre de l'utilisation de l'application SwimHub Connect, nous accordons une importance primordiale au respect de votre vie privée et à la protection de vos données à caractère personnel.</p>
      <section>
        <h2>1. Responsable du traitement</h2>
        <p>Les données sont traitées par l'éditeur de l'application SwimHub Connect. Pour toute question, vous pouvez contacter le support à tout moment via le système de tickets intégré à l'application.</p>
      </section>
      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li><strong>Données d'identification :</strong> nom, prénom.</li>
          <li><strong>Données de contact :</strong> adresse e-mail, téléphone (facultatif).</li>
          <li><strong>Données de sécurité :</strong> mots de passe, stockés sous forme de condensé cryptographique irréversible (« hash »).</li>
          <li><strong>Données professionnelles :</strong> diplômes, qualifications (ex. BNSSA, BEESAN, BPJEPS AAN) et dates d'expiration ou de recyclage.</li>
          <li><strong>Données d'activité :</strong> plannings, historiques des présences, absences et remplacements.</li>
        </ul>
      </section>
      <section>
        <h2>3. Finalités du traitement</h2>
        <ul>
          <li>Assurer le bon fonctionnement du service de planification et de remplacement.</li>
          <li>Permettre aux administrateurs de votre ou vos clubs d'organiser les activités sportives en conformité avec la réglementation (vérification des diplômes).</li>
          <li>Sécuriser l'accès à votre compte et vérifier la validité de votre adresse e-mail.</li>
          <li>Envoyer des notifications liées à l'activité de l'application (vérification d'e-mail, réinitialisation de mot de passe, rappels de recyclage de diplômes, alertes d'abonnement).</li>
        </ul>
      </section>
      <section>
        <h2>4. Hébergement et sécurité</h2>
        <p>Vos données sont hébergées sur des serveurs sécurisés situés dans l'Union européenne. Les mots de passe sont chiffrés. Nous mettons en œuvre des mesures techniques et organisationnelles pour prévenir toute perte, altération ou fuite de données.</p>
      </section>
      <section>
        <h2>5. Partage des données</h2>
        <p>Vos données personnelles ne sont <strong>jamais vendues</strong> à des tiers. Elles sont uniquement accessibles :</p>
        <ul>
          <li>à vous-même ;</li>
          <li>aux administrateurs du ou des clubs que vous avez explicitement rejoints ;</li>
          <li>aux autres éducateurs de votre club de manière restreinte (uniquement pour coordonner les plannings et les remplacements). Le motif d'une absence n'est visible que des responsables.</li>
        </ul>
      </section>
      <section>
        <h2>6. Durée de conservation</h2>
        <p>Les données sont conservées pendant toute la durée de validité de votre compte. Tout compte dont l'adresse e-mail n'est pas vérifiée dans un délai de 30 jours suivant sa création est automatiquement supprimé. Si vous supprimez votre compte, ou si votre club supprime votre accès, vos données d'identification sont effacées ou anonymisées dans un délai de 30 jours.</p>
      </section>
      <section>
        <h2>7. Vos droits (RGPD)</h2>
        <p>Conformément au Règlement général sur la protection des données (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès et de rectification :</strong> depuis votre profil et vos paramètres.</li>
          <li><strong>Droit à l'effacement (« droit à l'oubli ») et à la portabilité :</strong> via un ticket adressé au support de l'application.</li>
        </ul>
      </section>
    </LegalLayout>
  )
}
