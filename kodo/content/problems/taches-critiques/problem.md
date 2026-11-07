---
id: taches-critiques
title: Tâches critiques
chapter: n4-graphes
order: 5
tags: [graphes, parcours-en-largeur, programmation-dynamique]
samples: 2
---

## Énoncé
Un projet est découpé en `N` tâches, numérotées de `1` à `N`. La tâche `i` dure `D[i]` unités de temps. Certaines tâches doivent attendre la fin d'autres tâches : une contrainte `A B` signifie que la tâche `B` ne peut commencer qu'une fois la tâche `A` terminée. Autrement, autant de tâches que l'on veut peuvent se dérouler en même temps.

Le projet commence à la date `0`. Sa **durée** est la date à laquelle sa dernière tâche se termine. Une tâche est **critique** si, quand on augmente sa durée de `1` (sans rien changer d'autre), la durée minimale du projet augmente.

Écris un programme qui calcule la durée minimale du projet et le nombre de tâches critiques. Si les contraintes empêchent de réaliser toutes les tâches, affiche `-1`.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de tâches et le nombre de contraintes.
- La deuxième ligne contient `N` entiers `D[1] … D[N]`.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : la tâche `B` ne peut commencer qu'après la fin de la tâche `A`.

## Sortie
Deux entiers séparés par une espace : la durée minimale du projet, puis le nombre de tâches critiques. Si le projet est irréalisable, affiche seulement `-1`.

## Contraintes
- 1 ≤ N ≤ 6 000
- 0 ≤ M ≤ 8 000
- 1 ≤ D[i] ≤ 1 000
- 1 ≤ A, B ≤ N et A ≠ B ; une même contrainte peut apparaître plusieurs fois

## Indices
1. Le projet est irréalisable exactement quand les contraintes forment un cycle. Un **ordre topologique** (chaque tâche placée après toutes celles qu'elle attend) le détecte : retire une à une les tâches qui n'attendent plus personne. S'il en reste à la fin, il y a un cycle.
2. En parcourant les tâches dans l'ordre topologique, la date de début au plus tôt d'une tâche est le maximum des dates de fin de celles qu'elle attend. La durée du projet est la plus longue **chaîne** de tâches, en additionnant leurs durées.
3. Une tâche est critique si une chaîne de durée maximale passe par elle. Calcule aussi, en parcourant l'ordre topologique à l'envers, la durée de la plus longue chaîne qui **commence** par chaque tâche : la tâche `v` est critique si `début[v] + reste[v]` est égal à la durée du projet.

## Solution
Les tâches et les contraintes forment un **graphe orienté** : un arc `A → B` par contrainte. La durée minimale du projet est la plus grande durée totale d'une chaîne de tâches qui se suivent dans ce graphe. Elle n'a de sens que si le graphe est **sans cycle** : sinon, les tâches d'un cycle s'attendent mutuellement et ne commencent jamais.

**Ordre topologique (algorithme de Kahn).** On compte pour chaque tâche le nombre d'arcs qui y entrent. On place dans une liste toutes les tâches à `0`, puis on la parcourt : traiter une tâche `u` retire ses arcs sortants, et une tâche dont le compteur tombe à `0` est ajoutée à la liste. Si la liste finale contient moins de `N` tâches, les tâches restantes sont bloquées par un cycle : on affiche `-1`.

**Dates au plus tôt.** Dans l'ordre topologique, toutes les tâches qu'attend `v` sont traitées avant elle. On pose `début[v] = max(début[u] + D[u])` sur les arcs `u → v` (ou `0` s'il n'y en a pas). La durée du projet est `T = max(début[v] + D[v])`.

**Tâches critiques.** Dans l'ordre topologique inversé, `reste[v] = D[v] + max(reste[w])` sur les arcs `v → w` : la durée de la plus longue chaîne qui commence par `v`. La plus longue chaîne qui **passe** par `v` dure `début[v] + reste[v]`. Si elle vaut `T`, allonger `v` de `1` allonge cette chaîne, donc le projet : `v` est critique. Sinon, cette chaîne dure au plus `T - 1`, et allonger `v` de `1` ne change pas `T`.

Complexité : **O(N + M)**.

Pourquoi les approches naïves échouent :
- Appliquer la définition (pour chaque tâche, augmenter sa durée et tout recalculer) coûte O(N × (N + M)), environ 10⁸ opérations : trop lent en Python.
- Relâcher les contraintes en boucle jusqu'à stabilité (« si `B` commence avant la fin de `A`, décaler `B` ») peut demander `N` tours de `M` contraintes quand les tâches sont données dans le mauvais ordre.
- Un parcours en profondeur récursif dépasse la limite de récursion de Python sur une chaîne de 6 000 tâches.

Pièges :
- Une tâche sans contrainte peut être critique : c'est le cas si elle dure à elle seule `T`.
- Les contraintes en double ne posent pas de problème avec Kahn, à condition de compter chaque arc dans le compteur d'arcs entrants, et de le décrémenter autant de fois.
- Une tâche critique n'est pas forcément sur **la** chaîne trouvée en remontant depuis la fin : plusieurs chaînes peuvent avoir la durée maximale, et toutes leurs tâches comptent.
