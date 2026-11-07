---
id: partage-du-temps-en-tourniquet
title: Partage du temps en tourniquet
chapter: p3-piles-files
order: 4
tags: [simulation, listes]
samples: 2
---

## Énoncé
Un processeur doit exécuter `N` tâches, numérotées de 1 à `N` ; la tâche `i` demande `Dᵢ` unités de temps de calcul. Au départ, à l'instant 0, les tâches attendent dans une file, dans l'ordre 1, 2, …, `N`.

Le processeur procède en **tourniquet** : il prend la tâche en tête de la file et la fait avancer pendant au plus `Q` unités de temps. Si elle est terminée, elle quitte la file ; sinon, elle retourne à la fin de la file avec le temps qui lui reste. Puis il passe à la tâche suivante, sans perte de temps.

Afficher l'instant où se termine chaque tâche.

## Entrée
La première ligne contient `N` et `Q`. La deuxième ligne contient `D₁, …, D_N`, séparés par des espaces.

## Sortie
Une ligne de `N` entiers : l'instant de fin de la tâche 1, de la tâche 2, …, de la tâche `N`.

## Contraintes
- 1 ≤ N ≤ 40 000
- 1 ≤ Q ≤ 1 000
- 1 ≤ Dᵢ ≤ 20 × Q

## Indices
1. Simuler avec une file qui contient les numéros des tâches pas encore terminées, et un tableau des temps restants.
2. Retirer la tête d'une liste Python avec `pop(0)` décale tous les autres éléments : avec 40 000 tâches et des centaines de milliers de passages, c'est trop lent. Utiliser `collections.deque` (en C++, `queue`).

## Solution
On simule exactement le processus. Une file contient les numéros des tâches en attente, un tableau `reste` leur temps restant, et une variable `t` l'instant présent. Tant que la file n'est pas vide, on retire la tâche `i` en tête, on la fait tourner pendant `d = min(Q, reste[i])` unités : `t` augmente de `d` et `reste[i]` diminue de `d`. Si `reste[i]` vaut 0, la tâche se termine à l'instant `t` ; sinon, on la remet en fin de file.

**Terminaison et coût.** Chaque passage diminue d'au moins 1 la somme des temps restants : la simulation s'arrête. Plus précisément, une tâche de durée `Dᵢ` passe en tête exactement `Dᵢ / Q` fois, arrondi à l'entier supérieur, donc au plus 20 fois ici : au plus 20N = 800 000 passages, chacun en quelques opérations avec une vraie file. Avec `pop(0)` sur une liste, chaque retrait décale toutes les tâches encore en attente, jusqu'à N = 40 000 : des milliards de déplacements.
