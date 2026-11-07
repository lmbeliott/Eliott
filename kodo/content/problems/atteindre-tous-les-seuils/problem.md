---
id: atteindre-tous-les-seuils
title: Atteindre tous les seuils
chapter: n3-dichotomie
order: 6
tags: [dichotomie, sommes-préfixes]
samples: 2
time_limit_ms: 500
---

## Énoncé
Un tableau contient N cases, numérotées de 1 à N, qui valent toutes `0` au départ. Chaque case i a un **seuil** S_i. On dispose d'une liste de M ajouts, à appliquer dans l'ordre : l'ajout (L, R, V) ajoute V à toutes les cases de L à R.

Écris un programme qui calcule le plus petit nombre k tel qu'après les k premiers ajouts, **chaque** case i vaut au moins S_i.

## Entrée
- La première ligne contient deux entiers N et M.
- La deuxième ligne contient N entiers S_1, S_2, …, S_N.
- Les M lignes suivantes contiennent chacune trois entiers L, R et V : un ajout.

## Sortie
Un seul entier : le plus petit k qui convient, ou `-1` si même après les M ajouts une case reste sous son seuil.

## Contraintes
- 1 ≤ N ≤ 12 000
- 1 ≤ M ≤ 5 000
- 1 ≤ S_i ≤ 10⁶
- 1 ≤ L ≤ R ≤ N
- 1 ≤ V ≤ 1 000

## Indices
1. Appliquer les ajouts un par un, case par case, et vérifier toutes les cases après chaque ajout peut coûter des dizaines de millions d'opérations : trop lent en Python. Pose-toi plutôt une question plus simple : pour un k donné, les k premiers ajouts suffisent-ils ?
2. Cette question se règle en O(N + k) avec un tableau de différences : `+V` en L, `−V` en R + 1, puis les sommes cumulées donnent la valeur de chaque case.
3. Les valeurs ne font qu'augmenter : si k ajouts suffisent, k + 1 aussi. Les réponses sont donc non, non, …, non, oui, oui : cherche le premier « oui » par dichotomie entre `0` (jamais suffisant, car les seuils sont ≥ 1) et M.

## Solution
**L'idée : chercher le nombre d'ajouts par dichotomie.** On se pose une question plus simple : « Après les k premiers ajouts, chaque case a-t-elle atteint son seuil ? »

Pour y répondre, on n'applique pas les ajouts case par case. On note chaque ajout dans un **tableau de différences** : `+V` en L et `−V` en R + 1. Les sommes cumulées de ce tableau, de gauche à droite, donnent la valeur de chaque case. On compare alors chaque case à son seuil. Coût : O(N + k).

Les ajouts ne retirent jamais rien : une case qui a atteint son seuil après k ajouts l'a encore atteint après k + 1. La réponse à la question est donc « non » pour les petits k, puis « oui » à partir d'un certain rang. On vérifie d'abord que les M ajouts suffisent (sinon on affiche `-1`), puis on cherche le premier « oui » par dichotomie entre `pas_assez = 0` et `assez = M`.

Sur le premier exemple, après 3 ajouts le tableau vaut 2 3 5 3 2 : la case 1 est sous son seuil 3. Après 4 ajouts, il vaut 3 4 5 3 2, et toutes les cases ont atteint leur seuil (3 1 4 2 2). La réponse est 4.

**Complexité.** La dichotomie fait environ log₂(5 000) ≈ 13 tours, chacun en O(N + M) : O((N + M) log M), environ 250 000 opérations.

**Pourquoi la solution naïve est trop lente.** Appliquer chaque ajout case par case coûte jusqu'à N opérations par ajout. Si la réponse arrive tard et que les ajouts sont longs, cela fait M × N = 6 × 10⁷ additions, plus les vérifications : plusieurs secondes en Python. Refaire le tableau de différences pour k = 1, 2, 3… est pire encore : O(M × (N + M)).

**Pièges.**
- Le tableau de différences a une case de plus (R + 1 peut valoir N + 1).
- Une case peut monter jusqu'à 5 000 × 1 000 = 5 × 10⁶ : les `int` suffisent, mais pense à vérifier ce genre de borne.
- Ne cherche pas entre 1 et M sans avoir vérifié le cas `-1` : la dichotomie supposerait à tort que M ajouts suffisent.
