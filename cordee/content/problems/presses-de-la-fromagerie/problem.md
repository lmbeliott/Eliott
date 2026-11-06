---
id: presses-de-la-fromagerie
title: Les presses de la fromagerie
chapter: n3-dichotomie
order: 2
tags: [dichotomie]
samples: 2
---

## Énoncé
La fromagerie de Valcorde possède N presses à fromage. La presse numéro i met exactement T_i minutes pour presser une tomme, et elle enchaîne les tommes sans jamais s'arrêter : elle en termine une après T_i minutes, une deuxième après 2 × T_i minutes, et ainsi de suite.

Toutes les presses démarrent en même temps. Lucas doit livrer M tommes au refuge des Aiguilles.

Écris un programme qui calcule le nombre minimal de minutes au bout duquel les presses, toutes ensemble, auront terminé au moins M tommes.

## Entrée
- La première ligne contient deux entiers N et M.
- La deuxième ligne contient N entiers T_1, T_2, …, T_N.

## Sortie
Un seul entier : le nombre minimal de minutes nécessaires pour obtenir au moins M tommes.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ M ≤ 10⁹
- 1 ≤ T_i ≤ 10⁹

## Indices
1. Si tu connais une durée t, sais-tu calculer combien de tommes sont terminées au bout de t minutes ? Et si t minutes suffisent, que dire de t + 1 minutes ?
2. La réponse peut être énorme (jusqu'à 10¹⁸) : impossible d'essayer toutes les durées une par une. Cherche la plus petite durée suffisante par dichotomie sur la réponse.
3. Pars de `trop_court = 0` (aucune tomme) et `suffisant = min(T) × M` (la presse la plus rapide fait tout à elle seule). Tant que l'écart dépasse 1, teste le milieu. En C++, arrête le calcul du nombre de tommes dès qu'il atteint M.

## Solution
**L'idée : la dichotomie sur la réponse.** En t minutes, la presse i termine `t // T_i` tommes (division entière). Le total `f(t)` de toutes les presses ne fait qu'augmenter avec t. Donc la question « t minutes suffisent-elles ? » a une réponse de la forme non, non, …, non, oui, oui, oui… On cherche le premier « oui ».

On garde deux bornes : `trop_court`, une durée dont on sait qu'elle ne suffit pas, et `suffisant`, une durée dont on sait qu'elle suffit. Au départ, `trop_court = 0` et `suffisant = min(T) × M`. Tant que `suffisant − trop_court > 1`, on teste `milieu` : s'il suffit, il devient `suffisant`, sinon il devient `trop_court`. À la fin, `suffisant` est la réponse.

Sur le premier exemple (presses de 2, 3 et 5 minutes, 8 tommes) : en 8 minutes on a 4 + 2 + 1 = 7 tommes, en 9 minutes 4 + 3 + 1 = 8 tommes. La réponse est 9.

**Complexité.** L'intervalle de recherche fait au plus 10¹⁸, donc environ 60 tests, chacun en O(N) : O(N log(min(T) × M)), soit environ 600 000 opérations.

**Pourquoi la solution naïve est trop lente.** Avancer minute par minute peut demander 10¹⁸ étapes. Simuler les tommes une à une (en cherchant à chaque fois la presse qui finit la prochaine) en demande M = 10⁹ : beaucoup trop aussi.

**Pièges.**
- La réponse peut atteindre 10¹⁸ : en C++, utilise des `long long` partout (bornes, milieu, total).
- Débordement caché : avec t proche de 10¹⁸ et 10 000 presses de 1 minute, la somme des `t / T_i` dépasse largement 2⁶³. Il faut **arrêter la somme dès qu'elle atteint M** : le total reste alors inférieur à M + 10¹⁸, ce qui tient dans un `long long`.
- Vérifie que la borne de départ `suffisant` suffit vraiment, et que `trop_court` ne suffit vraiment pas : sinon la dichotomie peut renvoyer une valeur fausse.
