---
id: score-sur-une-cible
title: Score sur une cible
chapter: p1-synthese
order: 1
tags: [boucles, conditions]
samples: 2
---

## Énoncé
Une cible est formée de cinq disques de même centre `(0, 0)`, de rayons 10, 20, 30, 40 et 50. Un tir au point `(X, Y)` rapporte 10 points s'il est dans le disque de rayon 10, 8 points s'il est dans celui de rayon 20 (mais pas dans le précédent), puis 6, 4 et 2 points pour les disques de rayons 30, 40 et 50. Un tir sur le bord d'un disque compte comme dedans. En dehors du disque de rayon 50, le tir rapporte 0 point.

Afficher le score total d'une série de `N` tirs, puis le nombre de tirs qui rapportent 0 point.

## Entrée
- La première ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient deux entiers `X` et `Y` : les coordonnées d'un tir.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le score total, puis le nombre de tirs à 0 point.

## Contraintes
- 1 ≤ N ≤ 1 000
- -100 ≤ X, Y ≤ 100

## Indices
1. La distance entre `(X, Y)` et le centre est la racine carrée de `X × X + Y × Y`. Pour éviter les racines et les nombres à virgule, comparer les carrés : le tir est dans le disque de rayon `r` quand `X × X + Y × Y ≤ r × r`.
2. Tester les disques du plus petit au plus grand avec `if`, `elif`… : le premier qui contient le tir donne les points.
3. Vérifier un tir sur un bord : `(6, 8)` est à distance exactement 10 du centre, il rapporte 10 points.

## Solution
Pour chaque tir, on calcule `d = X × X + Y × Y`, le carré de la distance au centre. Comparer `d` à `r × r` revient à comparer la distance à `r`, sans racine carrée ni nombre à virgule.

Une chaîne `if / elif / else` teste les disques du plus petit au plus grand : `d ≤ 100` donne 10 points, sinon `d ≤ 400` donne 8, sinon `d ≤ 900` donne 6, sinon `d ≤ 1600` donne 4, sinon `d ≤ 2500` donne 2, et sinon le tir est manqué : on augmente le compteur de tirs à 0 point. L'ordre des tests compte : un tir dans le disque de rayon 10 est aussi dans tous les autres, et c'est le plus petit disque qui donne les points.

Le piège : utiliser `<` au lieu de `≤`, ce qui retire des points aux tirs posés exactement sur un bord.
