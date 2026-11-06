---
id: composantes-connexes
title: Composantes connexes
chapter: n4-graphes
order: 1
tags: [graphes, parcours-en-profondeur]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Deux sommets sont dans la **même composante connexe** si l'on peut aller de l'un à l'autre en suivant des arêtes, éventuellement en passant par d'autres sommets.

Écris un programme qui calcule le nombre de composantes connexes du graphe et le nombre de sommets de la plus grande.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : une arête relie les sommets `A` et `B`.

Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
Deux lignes : le nombre de composantes connexes, puis le nombre de sommets de la plus grande composante.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Représente le graphe par des **listes d'adjacence** : pour chaque sommet, la liste de ses voisins.
2. Depuis un sommet pas encore visité, un parcours (en profondeur ou en largeur) visite exactement toute sa composante. Combien de fois lances-tu un nouveau parcours ?
3. Parcours les sommets de `1` à `N` ; chaque fois que tu en trouves un non visité, c'est une nouvelle composante : explore-la en comptant les sommets visités. Attention à la profondeur de récursion si tu écris un DFS récursif.

## Solution
On construit les listes d'adjacence, puis on parcourt les sommets de `1` à `N`. Chaque sommet non encore visité est le point de départ d'une **nouvelle composante** : un parcours en profondeur (avec une pile) ou en largeur (avec une file) marque tous les sommets de cette composante, et on compte combien il en a marqué. Le nombre de parcours lancés est le nombre de composantes ; on garde le maximum des tailles.

Chaque sommet est marqué une seule fois et chaque arête est regardée deux fois (une fois depuis chaque extrémité) : la complexité totale est **O(N + M)**.

Une idée naïve consiste à donner à chaque sommet une étiquette, puis à répéter « pour chaque arête, recopier la plus petite des deux étiquettes sur l'autre extrémité » jusqu'à ce que plus rien ne change. Sur une longue chaîne de sommets, il faut jusqu'à `N` passes sur les `M` arêtes, soit 10⁸ opérations : bien trop lent en Python.

Pièges :
- Un DFS **récursif** sur une chaîne de 10 000 sommets dépasse la limite de récursion de Python (1 000 par défaut). Utilise une pile explicite, ou `sys.setrecursionlimit`.
- Marque un sommet comme visité **au moment où tu l'ajoutes** à la pile ou à la file, sinon il peut y être ajouté plusieurs fois.
- Un sommet sans aucune arête forme une composante à lui tout seul.
