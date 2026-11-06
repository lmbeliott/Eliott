---
id: coloriage-en-deux-couleurs
title: Coloriage en deux couleurs
chapter: n4-graphes
order: 3
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. On veut colorier chaque sommet en **blanc** ou en **noir**, de sorte que les deux extrémités de chaque arête soient de couleurs différentes.

Écris un programme qui calcule le nombre minimal de sommets noirs dans un tel coloriage, ou qui affiche `-1` si aucun coloriage ne convient.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`.

Une même arête peut apparaître plusieurs fois.

## Sortie
Un seul entier : le nombre minimal de sommets noirs, ou `-1` s'il est impossible de respecter toutes les arêtes.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Si tu choisis la couleur d'un sommet, celle de tous ses voisins est imposée, puis celle des voisins de ses voisins… Jusqu'où va cette réaction en chaîne ?
2. Dans une composante connexe, choisir la couleur d'un seul sommet décide de toute la composante. Il n'y a donc que deux coloriages possibles par composante, l'un étant l'inverse de l'autre.
3. Colorie chaque composante par un parcours en largeur en alternant deux étiquettes. Si deux voisins reçoivent la même étiquette, c'est impossible. Sinon, dans chaque composante, peins en noir la plus petite des deux classes.

## Solution
Dans une composante connexe, dès que la couleur d'un sommet est fixée, celle de chaque voisin est imposée (l'autre couleur), et de proche en proche celle de toute la composante. Une composante n'a donc que **deux** coloriages possibles, l'un inverse de l'autre.

On étiquette chaque composante par un parcours en largeur : le départ reçoit l'étiquette `0`, chaque voisin l'étiquette opposée à celle du sommet d'où l'on vient. Si l'on trouve deux voisins de même étiquette, la composante contient un cycle de longueur impaire et aucun coloriage ne convient : on affiche `-1`. Sinon, on compte `c₀` et `c₁`, les tailles des deux classes dans la composante, et on peint en noir la plus petite : on ajoute `min(c₀, c₁)` au total. Les composantes sont indépendantes, donc ces choix se font séparément. Un sommet isolé compte pour `min(1, 0) = 0` : il reste blanc.

Complexité : **O(N + M)**, chaque sommet et chaque arête étant traités une fois.

Essayer les 2ᴺ coloriages est hors de question dès `N = 40`. Et la stratégie gloutonne « colorier le sommet en blanc dès que c'est possible », en parcourant les sommets dans l'ordre des numéros, se trompe : elle peut fixer deux sommets d'une même composante avant de découvrir qu'ils sont liés, ou choisir pour une composante le mauvais des deux coloriages.

Pièges :
- Un seul cycle impair, dans n'importe quelle composante, rend la réponse `-1` : il faut avoir étiqueté toutes les composantes avant d'afficher le total.
- Le minimum se prend composante par composante, pas sur le graphe entier : prendre la plus petite classe sur le graphe entier donne une réponse fausse dès qu'il y a plusieurs composantes déséquilibrées (c'est le cas du premier exemple).
