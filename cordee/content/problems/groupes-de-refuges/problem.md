---
id: groupes-de-refuges
title: Les groupes de refuges
chapter: n4-graphes
order: 1
tags: [graphes, parcours-en-profondeur]
samples: 2
---

## Énoncé
Après une nuit de tempête, Awa, responsable des secours de Valcorde, fait le point : beaucoup de sentiers sont coupés. Deux refuges sont dans le **même groupe** si l'on peut aller de l'un à l'autre en n'empruntant que des sentiers encore praticables, éventuellement en passant par d'autres refuges.

Écris un programme qui calcule le nombre de groupes de refuges et le nombre de refuges du plus grand groupe.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de refuges (numérotés de `1` à `N`) et le nombre de sentiers praticables.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : un sentier relie les refuges `A` et `B`, dans les deux sens.

Un sentier peut relier un refuge à lui-même, et deux refuges peuvent être reliés par plusieurs sentiers.

## Sortie
Deux lignes : le nombre de groupes, puis le nombre de refuges du plus grand groupe.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Représente le réseau par des **listes d'adjacence** : pour chaque refuge, la liste des refuges voisins.
2. Depuis un refuge pas encore visité, un parcours (en profondeur ou en largeur) visite exactement tout son groupe. Combien de fois lances-tu un nouveau parcours ?
3. Parcours les refuges de `1` à `N` ; chaque fois que tu en trouves un non visité, c'est un nouveau groupe : explore-le en comptant les refuges visités. Attention à la profondeur de récursion si tu écris un DFS récursif.

## Solution
On construit les listes d'adjacence, puis on parcourt les refuges de `1` à `N`. Chaque refuge non encore visité est le point de départ d'un **nouveau groupe** : un parcours en profondeur (avec une pile) ou en largeur (avec une file) marque tous les refuges de ce groupe, et on compte combien il en a marqué. Le nombre de parcours lancés est le nombre de groupes ; on garde le maximum des tailles.

Chaque refuge est marqué une seule fois et chaque sentier est regardé deux fois (une fois depuis chaque extrémité) : la complexité totale est **O(N + M)**.

Une idée naïve consiste à donner à chaque refuge une étiquette, puis à répéter « pour chaque sentier, recopier la plus petite des deux étiquettes sur l'autre » jusqu'à ce que plus rien ne change. Sur une longue chaîne de refuges, il faut jusqu'à `N` passes sur les `M` sentiers, soit 10⁸ opérations : bien trop lent en Python.

Pièges :
- Un DFS **récursif** sur une chaîne de 10 000 refuges dépasse la limite de récursion de Python (1 000 par défaut). Utilise une pile explicite, ou `sys.setrecursionlimit`.
- Marque un refuge comme visité **au moment où tu l'ajoutes** à la pile ou à la file, sinon il peut y être ajouté plusieurs fois.
- Un refuge sans aucun sentier forme un groupe à lui tout seul.
