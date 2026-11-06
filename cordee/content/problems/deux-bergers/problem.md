---
id: deux-bergers
title: Les deux bergers
chapter: n4-graphes
order: 3
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
Cet été, deux bergers, Inès et Malik, se partagent les `N` alpages de Valcorde : chaque alpage sera gardé par l'un des deux. Certaines paires d'alpages sont **voisines** : si un même berger les gardait toutes les deux, ses troupeaux se mélangeraient. Deux alpages voisins doivent donc être gardés par des bergers différents.

Inès, qui s'occupe aussi de la fromagerie, veut garder le moins d'alpages possible. Écris un programme qui calcule le nombre minimal d'alpages confiés à Inès dans un partage qui respecte toutes les paires voisines, ou qui affiche `-1` si aucun partage ne convient.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre d'alpages (numérotés de `1` à `N`) et le nombre de paires voisines.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : les alpages `A` et `B` sont voisins.

Une même paire peut apparaître plusieurs fois.

## Sortie
Un seul entier : le nombre minimal d'alpages confiés à Inès, ou `-1` s'il est impossible de respecter toutes les paires voisines.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Si tu choisis le berger d'un alpage, celui de tous ses voisins est imposé, puis celui des voisins de ses voisins… Jusqu'où va cette réaction en chaîne ?
2. Dans un groupe d'alpages reliés entre eux (une composante connexe), choisir le berger d'un seul alpage décide de tout le groupe. Il n'y a donc que deux partages possibles par groupe, l'un étant l'inverse de l'autre.
3. Colorie chaque composante par un parcours en largeur en alternant les deux couleurs. Si deux voisins reçoivent la même couleur, c'est impossible. Sinon, Inès prend, dans chaque composante, la plus petite des deux couleurs.

## Solution
Les alpages et les paires voisines forment un graphe. Dans une composante connexe, dès que le berger d'un alpage est fixé, celui de chaque voisin est imposé (l'autre berger), et de proche en proche celui de toute la composante. Une composante n'a donc que **deux** partages possibles, l'un inverse de l'autre.

On colorie chaque composante par un parcours en largeur : le départ reçoit la couleur `0`, chaque voisin la couleur opposée à celle de l'alpage d'où l'on vient. Si l'on trouve deux voisins de même couleur, la composante contient un cycle de longueur impaire et aucun partage ne convient : on affiche `-1`. Sinon, on compte `c₀` et `c₁`, les tailles des deux couleurs dans la composante, et Inès prend la plus petite : on ajoute `min(c₀, c₁)` au total. Les composantes sont indépendantes, donc ces choix se font séparément. Un alpage isolé compte pour `min(1, 0) = 0` : on le confie à Malik.

Complexité : **O(N + M)**, chaque alpage et chaque paire étant traités une fois.

Essayer les 2ᴺ partages est hors de question dès `N = 40`. Et la stratégie gloutonne « donner l'alpage à Malik dès que c'est possible », en parcourant les alpages dans l'ordre des numéros, se trompe : elle peut fixer deux alpages d'une même composante avant de découvrir qu'ils sont liés, ou choisir pour une composante le mauvais des deux partages.

Pièges :
- Un seul cycle impair, dans n'importe quelle composante, rend la réponse `-1` : il faut avoir colorié toutes les composantes avant d'afficher le total.
- Le minimum se prend composante par composante, pas sur le graphe entier : prendre la plus petite couleur sur le graphe entier donne une réponse fausse dès qu'il y a plusieurs composantes déséquilibrées (c'est le cas du premier exemple).
