---
id: fusionner-par-paquets-de-k
title: Fusionner par paquets de K
chapter: n3-glouton
order: 6
tags: [glouton, tri]
samples: 2
---

## Énoncé
On a N tas de jetons : le tas numéro i contient S_i jetons. En une opération, on choisit **entre 2 et K tas** et on les réunit en un seul tas. Cette opération coûte le nombre de jetons du nouveau tas.

Écris un programme qui calcule le coût total minimal pour réunir tous les jetons en un seul tas.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers S_1, S_2, …, S_N.

## Sortie
Un seul entier : le coût total minimal. Si N vaut `1`, il n'y a rien à faire et le coût est `0`.

## Contraintes
- 1 ≤ N ≤ 25 000
- 2 ≤ K ≤ 30 000
- 1 ≤ S_i ≤ 10 000

## Indices
1. Un jeton est payé une fois à chaque fusion qui touche son tas. Les petits tas peuvent être fusionnés souvent, les gros tas doivent l'être le moins souvent possible. Avec K = 2, fusionner à chaque fois les deux plus petits tas est optimal.
2. Avec K quelconque, fusionner à chaque fois les K plus petits tas n'est pas toujours optimal : regarde le premier exemple. Le problème vient de la **dernière** fusion, qui peut prendre moins de K tas, alors que c'est elle qui touche tous les jetons.
3. Une fusion de K tas enlève K − 1 tas. Ajoute des tas vides (0 jeton) jusqu'à ce que (nombre de tas − 1) soit un multiple de K − 1 : ils ne coûtent rien. Ensuite, fusionne toujours les K plus petits tas, avec un tas (`heapq` ou `priority_queue`).

## Solution
**Voir les fusions comme un arbre.** Chaque fusion réunit des tas en un nouveau tas : on obtient un arbre dont les feuilles sont les tas de départ et dont chaque nœud a entre 2 et K enfants. Un jeton est payé une fois par fusion au-dessus de sa feuille, donc le coût total est la somme des `S_i × profondeur(i)`. On veut placer les gros tas près du haut de l'arbre, et les petits tout en bas.

**L'idée gloutonne : les plus petits ensemble, le plus bas possible.** Pour K = 2, c'est le codage de Huffman : on fusionne toujours les deux plus petits tas. Pour K quelconque, l'arbre idéal a des nœuds pleins, de K enfants exactement, pour que le moins de jetons possible soient payés souvent. Chaque fusion de K tas enlève K − 1 tas : toutes les fusions peuvent être pleines seulement si `N − 1` est un multiple de `K − 1`.

Sinon, une fusion au moins prendra moins de K tas. Il vaut mieux que ce soit la toute première, celle qui réunit les plus petits tas, tout en bas de l'arbre : un « trou » en haut de l'arbre fait payer une fusion de plus à beaucoup de jetons. L'astuce la plus simple : ajouter des tas vides (0 jeton) jusqu'à ce que `nombre de tas − 1` soit un multiple de `K − 1`. Ces tas ne coûtent rien et seront fusionnés dès la première opération. On fusionne ensuite toujours les K plus petits tas. L'échange qui justifie le glouton est le même que pour Huffman : dans un arbre optimal, on peut toujours échanger des feuilles pour que les K plus petites soient sœurs, au niveau le plus profond, sans augmenter le coût.

Sur le premier exemple (5 1 2 4, K = 3), on ajoute un tas vide : 0 + 1 + 2 = 3 (coût 3), puis 3 + 4 + 5 = 12 (coût 12), total 15. Fusionner tout de suite les trois plus petits (1 + 2 + 4 = 7, puis 5 + 7 = 12) coûte 19.

**Complexité.** On ajoute au plus K − 2 tas vides. Chaque fusion fait K retraits et un ajout dans un tas : O((N + K) log(N + K)) en tout.

**Pourquoi les solutions simples ne marchent pas.** Le glouton « les K plus petits à chaque fois » sans tas vides se trompe dès que `N − 1` n'est pas un multiple de `K − 1`. Essayer toutes les façons de fusionner est exponentiel. Et refaire un tri complet après chaque fusion coûte O(N² log N).

**Pièges.**
- Le coût total dépasse 2³¹ (plus de 3 × 10⁹ pour K = 2, N = 25 000 et de gros tas) : utilise des `long long` en C++.
- Quand K > N, on fusionne tout d'un coup : le coût est la somme de tous les tas. Avec les tas vides, le programme le trouve tout seul.
- Quand N = 1, le coût est `0` : (N − 1) est déjà un multiple de K − 1 et la boucle ne fait rien.
