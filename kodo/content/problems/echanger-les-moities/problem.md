---
id: echanger-les-moities
title: Échanger les moitiés
chapter: p3-recursivite
order: 3
tags: [récursivité, chaînes]
samples: 2
---

## Énoncé
On transforme un mot de la façon suivante. Un mot d'une seule lettre ne change pas. Un mot plus long est coupé en deux : G, formé de ses ⌊n/2⌋ premières lettres (n est la longueur du mot), et D, formé des lettres restantes. On transforme G et D selon la même règle, ce qui donne g et d, puis on recolle les deux morceaux, dans l'ordre de son choix : `g + d` ou `d + g`.

Par exemple, `dcba` se coupe en `dc` et `ba`, qui peuvent devenir `cd` et `ab`. En recollant dans l'ordre `ab + cd`, on obtient `abcd`.

Trouver le plus petit mot, dans l'ordre alphabétique (celui du dictionnaire), qu'on peut obtenir à partir du mot donné.

## Entrée
Une ligne contenant le mot, formé de lettres minuscules.

## Sortie
Le plus petit mot qu'on peut obtenir.

## Contraintes
- 1 ≤ longueur du mot ≤ 100 000

## Indices
1. Essayer tous les choix possibles est hors de question : il y a un choix par découpage, soit près de 100 000 choix, et 2^100 000 combinaisons.
2. Tous les mots qu'on peut obtenir à partir de G ont la même longueur. Pour rendre `g + d` le plus petit possible, que faut-il choisir pour g, puis pour d ?
3. Une fonction récursive `meilleur(m)` renvoie le plus petit mot obtenu à partir de `m` : il suffit de comparer `meilleur(G) + meilleur(D)` et `meilleur(D) + meilleur(G)`.

## Solution
On écrit une fonction récursive `meilleur(m)`. Si `m` a une lettre, elle le renvoie. Sinon, elle coupe `m` en G et D, calcule `g = meilleur(G)` et `d = meilleur(D)`, et renvoie le plus petit des deux mots `g + d` et `d + g`.

**Correction.** Par récurrence sur la longueur. Supposons que `meilleur(G)` et `meilleur(D)` sont les plus petits mots obtenus à partir de G et de D. Tous les mots obtenus à partir de G ont la longueur de G. Pour comparer deux mots `g₁ + d₁` et `g₂ + d₂` de cette forme, on compare d'abord les débuts `g₁` et `g₂`, de même longueur, et seulement en cas d'égalité les fins. Le plus petit mot de la forme `g + d` est donc `meilleur(G) + meilleur(D)`. De même, le plus petit mot de la forme `d + g` est `meilleur(D) + meilleur(G)`. Le plus petit mot possible est le plus petit des deux.

**Coût.** Chaque découpage divise la longueur par deux : la profondeur des appels est d'environ log₂(100 000) ≈ 17, sans danger pour la pile. À chaque niveau de profondeur, les morceaux traités ont une longueur totale n, et on fait sur eux des copies et des comparaisons proportionnelles à leur longueur : le travail total est de l'ordre de n × 17 opérations. Essayer toutes les combinaisons demanderait 2^(n−1) mots.
