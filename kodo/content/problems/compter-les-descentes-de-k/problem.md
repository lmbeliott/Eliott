---
id: compter-les-descentes-de-k
title: Compter les descentes de K
chapter: n3-complexite
order: 3
tags: [sommes-préfixes, dictionnaires]
samples: 2
---

## Énoncé
Une courbe part de la hauteur 0 et avance pas à pas : à chaque pas, un symbole indique si elle monte de 1 (`+`), descend de 1 (`-`) ou reste au même niveau (`=`). Les points de la courbe sont numérotés de 0 à N : le point 0 est le départ, et le point i est atteint juste après le i-ème pas.

Écris un programme qui compte les paires de points (i, j), avec i < j, telles que le point j est exactement K plus bas que le point i.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N symboles collés, chacun `+`, `-` ou `=`.

## Sortie
Un seul entier : le nombre de paires (i, j) avec 0 ≤ i < j ≤ N telles que la hauteur du point i moins la hauteur du point j vaut exactement K.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ N

## Indices
1. Calcule d'abord la hauteur de chaque point, en partant de `0` pour le point 0. Tester toutes les paires de points demanderait environ 5 milliards de comparaisons : il faut mieux.
2. Parcours les points dans l'ordre. Pour un point j de hauteur h, les départs possibles sont les points déjà vus de hauteur h + K. Il suffit donc de savoir combien de points déjà vus ont chaque hauteur.
3. Garde un dictionnaire `vues` : `vues[h]` = nombre de points déjà rencontrés à la hauteur h. Pour chaque point j, ajoute `vues[h + K]` au total, puis augmente `vues[h]` de 1. Attention, la réponse peut être très grande.

## Solution
**L'idée : hauteurs cumulées et comptage.** La hauteur du point i est une somme préfixe : le nombre de `+` moins le nombre de `-` parmi les i premiers pas. On veut compter les paires i < j avec `hauteur[i] = hauteur[j] + K`.

On parcourt les points de 0 à N en tenant à jour un dictionnaire `vues`, où `vues[h]` est le nombre de points déjà parcourus qui sont à la hauteur h. Arrivé au point j, de hauteur h, les points de départ possibles sont exactement les points précédents de hauteur h + K : on ajoute `vues[h + K]` à la réponse. Ensuite seulement, on ajoute le point j au dictionnaire. Cet ordre garantit qu'on ne compte que des paires avec i < j, et chacune une seule fois.

Sur l'exemple `+--=+-` avec K = 1, les hauteurs des points 0 à 6 sont `0 1 0 -1 -1 0 -1`. Le point 6 (hauteur −1) forme une paire avec les points 0, 2 et 5 (hauteur 0), ce qui fait 3 paires ; au total on en trouve 9.

**Complexité.** Une seule boucle de N + 1 tours, avec des opérations en temps constant sur le dictionnaire : O(N).

**Pourquoi la solution naïve est trop lente.** Tester toutes les paires de points fait environ N²/2 = 5 × 10⁹ comparaisons pour N = 100 000 : des heures en Python, plusieurs secondes même en C++.

**Pièges.**
- La réponse peut dépasser 2³¹ (par exemple 45 000 points à la hauteur 0 suivis de 55 000 points à la hauteur −K donnent près de 2,5 milliards de paires) : utilise un `long long` en C++.
- Les hauteurs peuvent être négatives. Un dictionnaire n'a pas de problème avec ça ; en C++, on peut aussi utiliser un tableau de taille 2N + 1 en décalant les indices de N.
- Le point 0 compte aussi : n'oublie pas de l'ajouter au dictionnaire avant le premier pas.
