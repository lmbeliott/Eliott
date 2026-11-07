---
id: couples-de-produit-au-plus-n
title: Couples de produit au plus N
chapter: p3-complexite
order: 6
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
Compter les couples (a, b) d'entiers strictement positifs tels que a × b ≤ N. L'ordre compte : (2, 3) et (3, 2) sont deux couples différents.

Par exemple, pour N = 6, il y a 14 couples : (1, 1) à (1, 6), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (4, 1), (5, 1) et (6, 1).

## Entrée
Une ligne contenant N.

## Sortie
Le nombre de couples.

## Contraintes
- 1 ≤ N ≤ 10¹²

## Indices
1. Pour a fixé, les valeurs de b possibles sont 1, 2, …, ⌊N/a⌋. La réponse est donc ⌊N/1⌋ + ⌊N/2⌋ + … + ⌊N/N⌋. Mais cette somme a 10¹² termes.
2. Soit k = ⌊√N⌋. Dans un couple (a, b) avec a × b ≤ N, le plus petit des deux nombres est au plus k (sinon le produit dépasserait N).
3. Compter les couples avec a ≤ k, ceux avec b ≤ k (c'est le même nombre, par symétrie), puis retirer ceux qui ont été comptés deux fois.

## Solution
Pour a fixé, il y a ⌊N/a⌋ valeurs de b. Le nombre de couples vaut donc Σ_{a=1..N} ⌊N/a⌋, ce qui est aussi la somme des nombres de diviseurs des entiers de 1 à N (chaque couple (a, b) avec a × b = m correspond à un diviseur a de m). La calculer directement coûte O(N) : 10¹² tours de boucle, des heures de calcul.

**Couper au milieu.** Posons k = ⌊√N⌋. Si a > k et b > k, alors a ≥ k + 1 et b ≥ k + 1, et a × b ≥ (k + 1)² > N. Tout couple valable a donc a ≤ k ou b ≤ k.

- Les couples avec a ≤ k sont au nombre de A = Σ_{a=1..k} ⌊N/a⌋.
- Par symétrie (on échange a et b), les couples avec b ≤ k sont aussi au nombre de A.
- Les couples avec a ≤ k **et** b ≤ k sont tous valables, puisque a × b ≤ k² ≤ N : il y en a k².

Par inclusion-exclusion, la réponse est 2A − k². Sur l'exemple N = 6 : k = 2, A = 6 + 3 = 9, et 2 × 9 − 4 = 14.

On peut le voir comme un dessin : les couples sont les points à coordonnées entières sous l'hyperbole a × b = N, figure symétrique par rapport à la diagonale. On compte les deux bandes de largeur k le long des axes, et on retire le carré k × k compté deux fois.

**Coût.** Une boucle de k ≤ 10⁶ tours : O(√N) au lieu de O(N). Pour calculer k sans erreur d'arrondi, on part de la racine flottante et on corrige : tant que (k + 1)² ≤ N, on augmente k ; tant que k² > N, on le diminue (en Python, `math.isqrt(N)` le fait directement). La réponse dépasse 2³¹ : `long long` en C++.
