---
id: ranger-trois-nombres
title: Ranger trois nombres
chapter: p1-conditions
order: 4
tags: [conditions]
samples: 2
---

## Énoncé
Lire trois entiers et les afficher du plus petit au plus grand.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `C` séparés par des espaces.

## Sortie
Une seule ligne contenant les trois entiers dans l'ordre croissant, séparés par des espaces.

## Contraintes
- −1 000 000 ≤ A, B, C ≤ 1 000 000

## Indices
1. Si `A > B`, on peut **échanger** les contenus de `A` et `B` à l'aide d'une troisième variable : `t = a`, puis `a = b`, puis `b = t`.
2. Après un échange entre `A` et `B`, puis un échange entre `B` et `C` (si nécessaire), le plus grand nombre est à coup sûr dans `C`.
3. Il reste alors à remettre `A` et `B` dans l'ordre.

## Solution
On remet les nombres en ordre par des échanges successifs, chacun commandé par un `if` :
1. si `A > B`, on échange `A` et `B` ;
2. si `B > C`, on échange `B` et `C` : à ce stade, `C` contient le plus grand des trois ;
3. si `A > B`, on échange encore `A` et `B` : les deux plus petits sont maintenant dans l'ordre.

Pour échanger deux variables, on passe par une variable auxiliaire `t` : écrire `a = b` puis `b = a` ne marche pas, car la valeur de `a` est perdue dès la première affectation.

Le troisième test est indispensable. Avec `5 9 1` : le premier test ne change rien ; le deuxième échange 9 et 1, ce qui donne `5 1 9` ; il faut encore échanger 5 et 1 pour obtenir `1 5 9`. Les égalités ne posent pas de problème : avec `>` strict, deux nombres égaux ne sont simplement pas échangés.
