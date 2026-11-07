---
id: couvrir-avec-le-moins-d-ensembles
title: Couvrir avec le moins d'ensembles
chapter: p4-exploration
order: 1
tags: [backtracking, bits]
samples: 2
---

## Énoncé
Une ville compte `M` quartiers, numérotés de `1` à `M`, et `N` emplacements possibles pour des antennes. Une antenne placée sur l'emplacement `i` couvre une liste donnée de quartiers. On veut couvrir **tous** les quartiers avec le moins d'antennes possible (au plus une par emplacement).

Calculer ce nombre minimal `K` d'antennes, puis le nombre de façons de choisir `K` emplacements qui couvrent tous les quartiers.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `N` lignes suivantes décrit un emplacement : un entier `L`, puis `L` numéros de quartiers distincts.

## Sortie
Deux entiers sur une ligne : `K`, puis le nombre de choix de `K` emplacements qui couvrent tout. Si même les `N` antennes ne couvrent pas tous les quartiers, afficher seulement `-1`.

## Contraintes
- 1 ≤ N ≤ 18
- 1 ≤ M ≤ 30
- 0 ≤ L ≤ M

## Indices
1. Il y a `2^N` façons de choisir des emplacements, au plus 262 144 : on peut toutes les essayer.
2. Coder un choix d'emplacements par un entier dont le bit `i` vaut 1 si l'emplacement `i` est pris, et l'ensemble des quartiers couverts par un entier sur `M` bits. La réunion devient un « ou » bit à bit.
3. Recalculer la réunion de chaque choix depuis zéro coûte `N` opérations par choix. On peut la déduire du choix privé de son bit le plus bas, déjà calculé.

## Solution
On code l'ensemble des quartiers couverts par l'emplacement `i` par un entier `couvre_i` dont le bit `q − 1` vaut 1 si le quartier `q` est couvert. Un choix d'emplacements est un **masque** de `N` bits, de 0 à `2^N − 1` ; les quartiers qu'il couvre sont le « ou » des `couvre_i` des bits à 1, et tout est couvert quand ce « ou » vaut `2^M − 1`.

Pour ne pas refaire `N` opérations par masque, on remplit un tableau `union[masque]` dans l'ordre croissant : si `b` est le bit le plus bas du masque (`masque & -masque`), d'indice `i`, alors `union[masque] = union[masque − b] | couvre_i`, et `masque − b` est plus petit, donc déjà calculé. On tient de même le nombre de bits à 1 de chaque masque. Un dernier passage trouve la plus petite taille `K` d'un masque qui couvre tout, puis compte les masques de taille `K` qui couvrent tout.

**Complexité.** O(2^N) : environ 260 000 masques, quelques opérations chacun. Recalculer chaque réunion bit par bit coûterait `N` fois plus, soit près de 5 millions d'opérations : cela reste faisable ici, mais plusieurs fois plus lent, et la différence devient décisive dès que `N` grandit un peu.

**Remarque.** Ce problème, la **couverture par ensembles**, est réputé difficile : on ne connaît aucun algorithme qui le résolve en temps polynomial dans le cas général. L'énumération exhaustive n'est raisonnable que parce que `N` est petit.
