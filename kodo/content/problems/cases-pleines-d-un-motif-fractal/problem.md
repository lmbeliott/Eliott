---
id: cases-pleines-d-un-motif-fractal
title: Cases pleines d'un motif fractal
chapter: n3-recursivite
order: 8
tags: [récursivité, grilles, sommes-préfixes]
samples: 2
---

## Énoncé
Un **motif** est une grille M × M de cases `#` (pleines) et `.` (vides). À partir de ce motif, on fabrique des grilles carrées de plus en plus grandes :
- la grille d'ordre 0 est une seule case pleine ;
- la grille d'ordre t (t ≥ 1) a Mᵗ lignes et Mᵗ colonnes. On la découpe en M × M blocs de M^(t−1) × M^(t−1) cases. Le bloc situé à la ligne i et à la colonne j des blocs est une copie de la grille d'ordre t − 1 si la case (i, j) du motif est `#`, et il est entièrement vide sinon.

Par exemple, avec le motif `###`, `#.#`, `###`, la grille d'ordre 1 est le motif lui-même, et la grille d'ordre 2 fait 9 × 9 cases avec un trou de 3 × 3 au centre.

Écris un programme qui répond à Q questions sur la grille d'ordre K : combien de cases pleines contient un rectangle donné ?

## Entrée
- La première ligne contient trois entiers M, K et Q.
- Les M lignes suivantes contiennent chacune M caractères `#` ou `.` : le motif.
- Les Q lignes suivantes contiennent chacune quatre entiers L1, C1, L2 et C2 : le rectangle va de la ligne L1 à la ligne L2 et de la colonne C1 à la colonne C2, bords compris. Lignes et colonnes sont numérotées à partir de 1.

## Sortie
Q lignes : pour chaque question, dans l'ordre, le nombre de cases pleines du rectangle.

## Contraintes
- 2 ≤ M ≤ 5
- 0 ≤ K et Mᴷ ≤ 10⁹
- 1 ≤ Q ≤ 1 000
- 1 ≤ L1 ≤ L2 ≤ Mᴷ et 1 ≤ C1 ≤ C2 ≤ Mᴷ

## Indices
1. La grille peut faire 10⁹ × 10⁹ cases : impossible de la construire. Comme pour les sommes préfixes en deux dimensions, ramène chaque rectangle à quatre « coins » : P(r, c), le nombre de cases pleines dans les r premières lignes et les c premières colonnes.
2. Pour calculer P(r, c) à l'ordre t, découpe en blocs de côté s = M^(t−1) : les blocs entièrement dans le coin, puis une bande en bas (r n'est pas un multiple de s), une bande à droite, et le bloc du coin. Les blocs entiers se comptent directement, le reste est le même problème à l'ordre t − 1.
3. Ne découpe pas la bande du bas bloc par bloc en appelant la fonction sur chacun : ces blocs sont tous coupés de la même façon (leurs rr premières lignes, en entier). Calcule P(rr, s) à l'ordre t − 1 **une seule fois** et multiplie par le nombre de `#` du motif dans cette rangée de blocs. Garde aussi les résultats déjà calculés dans un dictionnaire.

## Solution
**Se ramener à des coins.** Notons P(t, r, c) le nombre de cases pleines dans les r premières lignes et les c premières colonnes de la grille d'ordre t. Comme pour les sommes préfixes en deux dimensions, le rectangle (L1, C1, L2, C2) contient
`P(K, L2, C2) − P(K, L1 − 1, C2) − P(K, L2, C1 − 1) + P(K, L1 − 1, C1 − 1)` cases pleines.

**Les tailles d'abord.** La grille d'ordre t a pour côté `cote[t] = Mᵗ` et contient `total[t] = Nᵗ` cases pleines, où N est le nombre de `#` du motif.

**La récursion.** Pour calculer P(t, r, c), on découpe en blocs de côté s = `cote[t − 1]`. On écrit r = br × s + rr et c = bc × s + rc (divisions entières). Le coin contient :
- les blocs entiers (lignes de blocs < br, colonnes de blocs < bc) : chacun vaut `total[t − 1]` s'il est plein dans le motif ;
- si rr > 0, la bande du bas : les blocs de la rangée br, colonnes < bc, dont on garde les rr premières lignes **en entier**. Chacun contient P(t − 1, rr, s) cases pleines ;
- si rc > 0, la bande de droite : les blocs de la colonne bc, lignes < br, dont on garde les rc premières colonnes. Chacun contient P(t − 1, s, rc) ;
- si rr > 0 et rc > 0, le bloc du coin (br, bc), qui contient P(t − 1, rr, rc) s'il est plein.

On compte les `#` du motif dans chaque zone avec des sommes préfixes sur le motif. Les cas de base : P vaut 0 si r = 0 ou c = 0, et `total[t]` si le coin est toute la grille (cela couvre l'ordre 0).

Sur le premier exemple (tapis 9 × 9, ligne 2 entière), on calcule P(2, 2, 9) − P(2, 1, 9). Avec s = 3 : br = 0 et rr = 2, bc = 3 et rc = 0. Il n'y a ni bloc entier ni bande de droite, seulement la bande du bas : 3 blocs pleins, chacun avec P(1, 2, 3) = 5 cases pleines (`###` puis `#.#`). P(2, 2, 9) = 15 et de même P(2, 1, 9) = 3 × 3 = 9 : la ligne 2 contient 6 cases pleines.

**Pourquoi c'est rapide.** Un appel P(t, r, c) en déclenche au plus trois à l'ordre t − 1 : P(t − 1, rr, s), P(t − 1, s, rc) et P(t − 1, rr, rc). Le premier n'en déclenche ensuite qu'un seul utile (sa bande du bas), le deuxième aussi. Et ces appels se répètent : P(t − 1, rr, rc) appelle P(t − 2, rr mod s', s'), exactement comme P(t − 1, rr, s). En gardant les résultats dans un dictionnaire, chaque coin coûte au plus 3K appels.

**Complexité.** O(K) appels par coin, soit O(Q × K) en tout, avec un petit dictionnaire : quelques centaines de milliers d'opérations.

**Pourquoi la solution naïve est trop lente.** Construire la grille est impossible au-delà de quelques milliers de cases de côté. Découper le rectangle bloc par bloc et appeler la fonction sur chaque bloc coupé semble raisonnable, mais une bande fine traverse jusqu'à M blocs, qui sont chacun coupés en M morceaux à l'ordre suivant, et ainsi de suite : Mᴷ appels, soit 2²⁹ pour M = 2.

**Pièges.**
- Le nombre de cases pleines peut atteindre (Mᴷ)², presque 10¹⁸ : utilise des `long long` en C++.
- Quand r = Mᵗ (toute la hauteur), br vaut M et rr vaut 0 : il n'y a pas de bande du bas, et il ne faut pas lire la ligne M du motif.
- Les bandes ne s'appellent que si le motif contient au moins un `#` dans la zone, et la bande du bas ne dépend pas de la colonne du bloc : un seul appel, multiplié.
