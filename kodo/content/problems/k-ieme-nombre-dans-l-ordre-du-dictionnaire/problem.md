---
id: k-ieme-nombre-dans-l-ordre-du-dictionnaire
title: K-ième nombre dans l'ordre du dictionnaire
chapter: p3-synthese
order: 8
tags: [mathématiques, chaînes]
samples: 2
---

## Énoncé
On range les entiers de 1 à N dans l'ordre du dictionnaire, comme des mots : on compare leurs écritures chiffre par chiffre, et un mot qui est le début d'un autre passe avant lui. Pour N = 13, on obtient 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9.

Répondre à Q questions : quel est le K-ième nombre de cette liste ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient N et K.

## Sortie
Q lignes : le K-ième nombre de la liste des entiers de 1 à N rangés dans l'ordre du dictionnaire.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ K ≤ N ≤ 10¹⁸

## Indices
1. Trier les N nombres est impossible pour N = 10¹⁸. Mais on peut sauter des blocs entiers : tous les nombres qui commencent par 1 viennent avant tous ceux qui commencent par 2.
2. Écrire une fonction `compter(debut, N)` qui renvoie le nombre d'entiers de 1 à N dont l'écriture commence par celle de `debut`. Pour `debut` = 12 : 12, puis 120 à 129, puis 1 200 à 1 299… en coupant à N.
3. Partir de `debut` = 1, qui est le premier nombre. Si les nombres commençant par `debut` sont moins de K (en comptant celui où l'on est), on les saute tous et on passe à `debut + 1`. Sinon, la réponse commence par `debut` : on descend vers `debut × 10`.

## Solution
**Compter un bloc.** Les entiers qui commencent par p (écrit en base 10) sont p, puis les 10 entiers de 10p à 10p + 9, puis les 100 entiers de 100p à 100p + 99, etc. La fonction `compter(p, N)` additionne, pour chaque longueur, la taille de l'intervalle [debut, fin] coupé à N : `min(N, fin) − debut + 1`, tant que `debut ≤ N`. Il y a au plus 19 longueurs.

**Descendre dans l'ordre.** Dans l'ordre du dictionnaire, le nombre p est suivi de tous les nombres qui commencent par p (dans l'ordre p0…, p1…, …, p9…), puis du bloc qui commence par p + 1. On garde le nombre courant p et le rang k qui reste à parcourir, en partant de p = 1 et k = K − 1 (le nombre 1 est le premier). Tant que k > 0 :

- si `compter(p, N) ≤ k`, la réponse n'est pas dans le bloc de p : on retire la taille du bloc à k et on passe à p + 1 ;
- sinon, la réponse est dans le bloc de p, mais ce n'est pas p lui-même (k > 0) : on passe au premier nombre après p, qui est 10p, et on retire 1 à k.

**Correction.** Invariant : la réponse est le (k + 1)-ième nombre de la liste à partir de p, et elle est dans le bloc du **parent** de p (le nombre p sans son dernier chiffre). Ainsi, on ne passe jamais de p = 19 à p = 20 : la réponse serait alors hors du bloc de 1. Le passage à p + 1 reste donc à l'intérieur du même bloc parent, où l'ordre des sous-blocs est bien p, p + 1, …

**Coût.** Chaque étape descend d'un chiffre ou passe au chiffre suivant : au plus 19 descentes et 10 passages par niveau, chacun avec un appel à `compter` en 19 étapes, soit quelques milliers d'opérations par question. En C++, il faut éviter que 10 × fin dépasse la capacité d'un `long long` : on arrête de multiplier dès que la borne dépasse N / 10.
