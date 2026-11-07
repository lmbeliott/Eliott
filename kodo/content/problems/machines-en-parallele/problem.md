---
id: machines-en-parallele
title: Machines en parallèle
chapter: n3-dichotomie
order: 2
tags: [dichotomie]
samples: 2
---

## Énoncé
Un atelier possède N machines. La machine numéro i met exactement T_i minutes pour fabriquer une pièce, et elle enchaîne les pièces sans jamais s'arrêter : elle en termine une après T_i minutes, une deuxième après 2 × T_i minutes, et ainsi de suite.

Toutes les machines démarrent en même temps. Écris un programme qui calcule le nombre minimal de minutes au bout duquel les machines, toutes ensemble, auront terminé au moins M pièces.

## Entrée
- La première ligne contient deux entiers N et M.
- La deuxième ligne contient N entiers T_1, T_2, …, T_N.

## Sortie
Un seul entier : le nombre minimal de minutes nécessaires pour obtenir au moins M pièces.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ M ≤ 10⁹
- 1 ≤ T_i ≤ 10⁹

## Indices
1. Si tu connais une durée t, sais-tu calculer combien de pièces sont terminées au bout de t minutes ? Et si t minutes suffisent, que dire de t + 1 minutes ?
2. La réponse peut être énorme (jusqu'à 10¹⁸) : impossible d'essayer toutes les durées une par une. Cherche la plus petite durée suffisante par dichotomie sur la réponse.
3. Pars de `trop_court = 0` (aucune pièce) et `suffisant = min(T) × M` (la machine la plus rapide fait tout à elle seule). Tant que l'écart dépasse 1, teste le milieu. En C++, arrête le calcul du nombre de pièces dès qu'il atteint M.

## Solution
**L'idée : la dichotomie sur la réponse.** En t minutes, la machine i termine `t // T_i` pièces (division entière). Le total `f(t)` de toutes les machines ne fait qu'augmenter avec t. Donc la question « t minutes suffisent-elles ? » a une réponse de la forme non, non, …, non, oui, oui, oui… On cherche le premier « oui ».

On garde deux bornes : `trop_court`, une durée dont on sait qu'elle ne suffit pas, et `suffisant`, une durée dont on sait qu'elle suffit. Au départ, `trop_court = 0` et `suffisant = min(T) × M`. Tant que `suffisant − trop_court > 1`, on teste `milieu` : s'il suffit, il devient `suffisant`, sinon il devient `trop_court`. À la fin, `suffisant` est la réponse.

Sur le premier exemple (machines de 2, 3 et 5 minutes, 8 pièces) : en 8 minutes on a 4 + 2 + 1 = 7 pièces, en 9 minutes 4 + 3 + 1 = 8 pièces. La réponse est 9.

**Complexité.** L'intervalle de recherche fait au plus 10¹⁸, donc environ 60 tests, chacun en O(N) : O(N log(min(T) × M)), soit environ 600 000 opérations.

**Pourquoi la solution naïve est trop lente.** Avancer minute par minute peut demander 10¹⁸ étapes. Simuler les pièces une à une (en cherchant à chaque fois la machine qui finit la prochaine) en demande M = 10⁹ : beaucoup trop aussi.

**Pièges.**
- La réponse peut atteindre 10¹⁸ : en C++, utilise des `long long` partout (bornes, milieu, total).
- Débordement caché : si tu prends une borne haute plus large que min(T) × M (par exemple 10¹⁸), la somme des `t / T_i` peut dépasser 2⁶³ : avec t ≈ 5 × 10¹⁷ et 10 000 machines de 1 minute, elle vaut 5 × 10²¹. **Arrête la somme dès qu'elle atteint M.** Avec `suffisant = min(T) × M`, chaque terme vaut au plus M et la somme reste sous N × M ≤ 10¹³, mais l'arrêt anticipé reste une bonne habitude.
- Vérifie que la borne de départ `suffisant` suffit vraiment, et que `trop_court` ne suffit vraiment pas : sinon la dichotomie peut renvoyer une valeur fausse.
