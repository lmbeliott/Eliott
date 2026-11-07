---
id: empiler-des-caisses
title: Empiler des caisses
chapter: p4-gloutons
order: 7
tags: [glouton, tri, mathématiques]
samples: 2
---

## Énoncé
On doit empiler N caisses les unes sur les autres, en une seule colonne. La caisse i pèse wᵢ kilos et a une **résistance** sᵢ. Le **risque** d'une caisse est le poids total des caisses posées au-dessus d'elle, moins sa résistance ; il peut être négatif. Le risque de la pile est le plus grand risque de ses caisses.

Afficher le plus petit risque possible d'une pile qui contient les N caisses, en choisissant bien l'ordre.

Par exemple, avec les caisses (w, s) = (10, 3), (2, 5) et (3, 3), la pile qui a (2, 5) en haut, puis (3, 3), puis (10, 3) en bas donne les risques 0 − 5 = −5, 2 − 3 = −1 et 5 − 3 = 2 : le risque de la pile vaut 2, et on ne peut pas faire mieux.

## Entrée
La première ligne contient N. Chacune des N lignes suivantes contient deux entiers wᵢ et sᵢ.

## Sortie
Le plus petit risque possible de la pile.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ wᵢ ≤ 10 000
- 1 ≤ sᵢ ≤ 10⁶

## Indices
1. Ni « les plus lourdes en bas », ni « les plus résistantes en bas » ne marche à coup sûr. Regarder deux caisses voisines dans la pile : qu'est-ce qui change quand on les échange ?
2. Si la caisse i est juste au-dessus de la caisse j, et que W est le poids au-dessus des deux, leurs risques valent W − sᵢ et W + wᵢ − s_j. Comparer avec l'ordre inverse.
3. Mettre en haut les caisses dont la somme wᵢ + sᵢ est la plus petite.

## Solution
**Échange de deux voisines.** Soit i posée juste au-dessus de j, et W le poids total au-dessus des deux. Les risques valent W − sᵢ pour i et W + wᵢ − s_j pour j ; les autres caisses ne sont pas concernées, car le poids au-dessus d'elles ne change pas si on échange i et j. Après l'échange, les risques valent W − s_j pour j et W + w_j − sᵢ pour i. Supposons wᵢ + sᵢ ≤ w_j + s_j. Alors W + wᵢ − s_j ≤ W + w_j − sᵢ, et W − sᵢ ≤ W + w_j − sᵢ : le plus grand des deux risques avec i au-dessus est au plus W + w_j − sᵢ, qui est un des risques de l'ordre échangé. Mettre au-dessus la caisse de plus petite somme w + s ne peut donc qu'améliorer le risque de la pile, ou le laisser égal.

**L'ordre optimal.** Partons d'une pile optimale. Tant que deux voisines sont rangées avec la plus grande somme w + s au-dessus, on les échange : le risque n'augmente pas, et le nombre de paires mal rangées diminue (comme dans le tri à bulles). On arrive à la pile triée par w + s croissant du haut vers le bas, qui est donc optimale. On la construit directement par un tri, puis on calcule les risques du haut vers le bas en cumulant les poids.

**Coût.** O(N log N). Essayer les N! ordres est impossible dès N = 12. Le risque peut être négatif : on initialise le maximum avec le risque de la première caisse, pas avec 0.
