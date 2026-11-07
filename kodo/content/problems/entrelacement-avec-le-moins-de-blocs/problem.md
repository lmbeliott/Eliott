---
id: entrelacement-avec-le-moins-de-blocs
title: Entrelacement avec le moins de blocs
chapter: n4-dynamique
order: 7
tags: [programmation-dynamique, chaînes]
samples: 2
---

## Énoncé
On donne deux mots `U` et `V`. Un **entrelacement** de `U` et `V` est un mot obtenu en mélangeant toutes les lettres de `U` et toutes celles de `V`, en gardant l'ordre des lettres de `U` entre elles et l'ordre des lettres de `V` entre elles. Par exemple, `aabba` est un entrelacement de `aba` et `ab` : on peut le lire `a` (de `U`), `a` (de `V`), `b` (de `U`), `b` (de `V`), `a` (de `U`).

Un **bloc** est un groupe maximal de lettres identiques qui se suivent : `aabba` a trois blocs, `aa`, `bb` et `a`.

Écris un programme qui calcule le nombre minimal de blocs d'un entrelacement de `U` et `V`.

## Entrée
- La première ligne contient le mot `U`.
- La deuxième ligne contient le mot `V`.

Les deux mots ne contiennent que des lettres minuscules de `a` à `z`.

## Sortie
Un seul entier : le nombre minimal de blocs d'un entrelacement de `U` et `V`.

## Contraintes
- 1 ≤ longueur de `U` ≤ 600
- 1 ≤ longueur de `V` ≤ 600

## Indices
1. Le nombre de blocs est `1` plus le nombre d'endroits où deux lettres voisines sont différentes. Quand on construit l'entrelacement de gauche à droite, que faut-il savoir du début déjà construit pour connaître le coût de la lettre suivante ?
2. Le début d'un entrelacement utilise les `i` premières lettres de `U` et les `j` premières de `V`. Sa dernière lettre est forcément `U[i]` ou `V[j]` (en numérotant à partir de `1`) : il suffit de savoir duquel des deux mots elle vient.
3. Calcule `finU[i][j]` (et `finV[i][j]`) : le nombre minimal de blocs d'un entrelacement des `i` premières lettres de `U` et des `j` premières de `V` qui se termine par une lettre de `U` (de `V`). La lettre ajoutée crée un nouveau bloc seulement si elle diffère de la précédente.

## Solution
Le nombre de blocs d'un mot vaut `1` plus le nombre de positions où une lettre diffère de la précédente. On construit l'entrelacement de gauche à droite : à chaque étape, on prend la prochaine lettre de `U` ou la prochaine lettre de `V`, et elle coûte un bloc de plus si elle est différente de la dernière lettre écrite.

**L'état.** Après avoir écrit les `i` premières lettres de `U` et les `j` premières de `V`, la dernière lettre écrite est `U[i]` ou `V[j]` : on n'a besoin de rien d'autre pour la suite. On note donc :
- `finU[i][j]` : le nombre minimal de blocs d'un entrelacement des `i` premières lettres de `U` et des `j` premières de `V`, qui se termine par `U[i]` ;
- `finV[i][j]` : la même chose, pour un entrelacement qui se termine par `V[j]`.

**Les transitions.** Pour finir par `U[i]`, la lettre d'avant est soit `U[i − 1]`, soit `V[j]` :

`finU[i][j] = min(finU[i − 1][j] + (U[i − 1] ≠ U[i]), finV[i − 1][j] + (V[j] ≠ U[i]))`

où `(x ≠ y)` vaut `1` si les lettres sont différentes et `0` sinon. C'est symétrique pour `finV[i][j]`. Au départ, `finU[1][0] = finV[0][1] = 1`, et les états impossibles (par exemple `finU[0][j]`) valent l'infini. On remplit les tableaux pour `i` et `j` croissants ; la réponse est `min(finU[n][m], finV[n][m])`, où `n` et `m` sont les longueurs des mots.

Sur le premier exemple, `aabba` a 3 blocs, et on ne peut pas faire mieux : `U = aba` est lu dans l'ordre dans l'entrelacement, et il faut déjà 3 blocs pour passer de `a` à `b` puis à `a`. Sur le deuxième, `aacbbb` (`aa` de `U`, `c` de `V`, `b` de `U`, puis `bb` de `V`) a 3 blocs, le minimum puisque les trois lettres `a`, `b` et `c` apparaissent.

**Complexité.** **O(n × m)** états, chacun calculé en temps constant : 360 000 états pour deux mots de 600 lettres.

**Pourquoi les autres idées échouent.** Il y a énormément d'entrelacements : pour deux mots de 600 lettres, plus de 10³⁵⁰. Un glouton qui prend la lettre identique à la dernière quand c'est possible, et sinon une lettre de `U`, se trompe dès le deuxième exemple : il écrit `aab` puis `cbb`, soit `aabcbb` et 4 blocs. Le bon choix dépend de toute la suite des deux mots.

**Pièges.**
- Il faut deux tableaux (ou une troisième dimension) : connaître seulement `i` et `j` ne dit pas quelle est la dernière lettre écrite.
- Pour `finU[i][j]` avec `i = 1`, la lettre d'avant ne peut venir que de `V` (si `j ≥ 1`) : attention aux bords des tableaux.
