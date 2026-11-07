---
id: morceaux-equilibres
title: Morceaux équilibrés
chapter: n2-chaines
order: 8
tags: [chaînes, listes]
samples: 3
---

## Énoncé
On te donne un mot `S` de `N` lettres. Les voyelles sont `a`, `e`, `i`, `o`, `u` et `y` ; toutes les autres lettres sont des consonnes.

Un **morceau** de `S` est une suite d'au moins une lettre consécutive de `S`. Un morceau est **équilibré** s'il contient autant de voyelles que de consonnes.

Écris un programme qui affiche la longueur du plus long morceau équilibré, puis le nombre de morceaux équilibrés. Deux morceaux qui commencent ou finissent à des positions différentes comptent séparément, même s'ils sont formés des mêmes lettres.

## Entrée
Une seule ligne contenant le mot `S`, en lettres minuscules sans accents.

## Sortie
Deux lignes :
- sur la première, la longueur du plus long morceau équilibré, ou `0` s'il n'y en a aucun ;
- sur la seconde, le nombre de morceaux équilibrés.

## Contraintes
- 1 ≤ N ≤ 100 000
- Le nombre de morceaux équilibrés peut dépasser 2³¹ : en C++, utilise un `long long`.

## Indices
1. Tester tous les morceaux un par un est trop lent : il y en a environ 5 milliards quand `N` vaut 100 000. Il faut un seul parcours du mot.
2. Lis le mot de gauche à droite en tenant un **solde** : `+1` pour chaque voyelle, `-1` pour chaque consonne. Note le solde avant la première lettre (il vaut 0), puis après chaque lettre. Le morceau compris entre deux moments où le solde est le même contient autant de voyelles que de consonnes.
3. Le solde reste entre `-N` et `N`. Garde deux listes de taille `2N + 1`, indexées par `solde + N` : la première fois qu'on a vu chaque solde, et le nombre de fois qu'on l'a vu. Quand le solde revient à une valeur déjà vue, cela donne un morceau équilibré pour chaque fois précédente, et le plus long part de la première fois.

## Solution
Lisons le mot de gauche à droite en tenant un **solde** : le nombre de voyelles moins le nombre de consonnes parmi les lettres déjà lues. On note `solde[0] = 0` avant la première lettre, puis `solde[j]` après les `j` premières lettres.

Le morceau formé des lettres `i + 1` à `j` contient `solde[j] - solde[i]` voyelles de plus que de consonnes. Il est donc équilibré exactement quand `solde[i] = solde[j]`. Les deux questions deviennent :
- le plus grand écart `j - i` entre deux moments de même solde ;
- le nombre de paires de moments `i < j` de même solde.

Comme le solde est toujours entre `-N` et `N`, on peut ranger les informations dans des listes de taille `2N + 1`, à l'indice `solde + N` :
- `premier[k]` : le premier moment où le solde valait `k - N` (`-1` si jamais vu) ;
- `compte[k]` : le nombre de moments déjà passés avec ce solde.

Pour chaque nouveau moment `j`, de solde d'indice `k` : si ce solde a déjà été vu, le plus long morceau équilibré qui finit ici commence juste après `premier[k]`, et il mesure `j - premier[k]` lettres. Le nombre de morceaux équilibrés qui finissent ici vaut `compte[k]` : on l'ajoute au total, puis on augmente `compte[k]` de 1.

Exemple avec `banane` : les soldes successifs sont `0, -1, 0, -1, 0, -1, 0`. Le solde 0 apparaît 4 fois, aux moments 0, 2, 4 et 6, ce qui donne 6 paires ; le solde -1 apparaît 3 fois, ce qui donne 3 paires. Il y a donc 9 morceaux équilibrés, et le plus long va du moment 0 au moment 6 : c'est le mot entier, de longueur 6.

Les pièges :
- oublier le solde 0 **avant** la première lettre : sans lui, on rate tous les morceaux qui commencent au début du mot ;
- se servir directement du solde comme indice : il peut être négatif. Le décalage de `N` le ramène entre 0 et `2N` ;
- tester tous les morceaux, même en mettant à jour les compteurs au fur et à mesure : cela fait environ `N² / 2` morceaux, soit 5 milliards pour `N = 100 000`. La méthode du solde ne fait qu'un passage ;
- en C++, le nombre de morceaux dépasse 2³¹ pour un mot de 100 000 lettres où voyelles et consonnes alternent.
