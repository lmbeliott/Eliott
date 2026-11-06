---
id: depassements-sur-la-piste
title: Les dépassements sur la piste
chapter: n4-structures
order: 1
tags: [fenwick, tri]
samples: 2
---

## Énoncé
Pour la course de fond de Valcorde, `N` skieurs s'élancent un par un, dans l'ordre de leurs dossards : le dossard `1` part le premier, puis le `2`, et ainsi de suite jusqu'au `N`. À l'arrivée, Mia note les dossards dans l'ordre où les skieurs franchissent la ligne.

On appelle **dépassement** toute paire de skieurs dont le premier parti arrive après le second : les dossards `a < b` forment un dépassement si `b` est arrivé avant `a`. Écris un programme qui compte les dépassements.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers distincts entre `1` et `N` : les dossards dans l'ordre d'arrivée.

## Sortie
Un seul entier : le nombre de dépassements.

## Contraintes
- 1 ≤ N ≤ 20 000

## Indices
1. Comparer toutes les paires fait environ 2 × 10⁸ comparaisons : beaucoup trop en Python.
2. Parcours les dossards dans l'ordre d'arrivée. Quand le dossard `d` arrive, combien de dépassements le concernent avec des skieurs déjà arrivés ? Il suffit de savoir combien de dossards déjà arrivés sont **plus grands** que `d`.
3. Tiens à jour un arbre de Fenwick sur les dossards : la case `d` vaut `1` si le dossard `d` est déjà arrivé. Une somme de préfixe donne alors le nombre de dossards déjà arrivés inférieurs à `d`.

## Solution
On parcourt la liste d'arrivée. Quand le dossard `d` franchit la ligne en `i`-ème position (en comptant à partir de `0`), `i` skieurs sont déjà arrivés. Ceux qui ont un dossard plus grand que `d` sont partis après lui et arrivés avant : chacun forme un dépassement avec `d`. En ajoutant ce nombre pour chaque skieur, chaque dépassement est compté exactement une fois (au moment où arrive le second des deux).

Il faut donc répondre vite à la question « combien de dossards déjà arrivés sont inférieurs à `d` ? » tout en ajoutant les dossards un par un. C'est exactement ce que fait un **arbre de Fenwick** sur le tableau `vu[1..N]` (`vu[d] = 1` si `d` est arrivé) :
- `somme(d)` donne le nombre de dossards déjà arrivés entre `1` et `d`, en O(log N) ;
- `ajoute(d)` met `vu[d]` à `1`, en O(log N).

Le nombre de dépassements dus à `d` vaut `i - somme(d)`. Complexité totale : **O(N log N)**.

L'algorithme naïf compare toutes les paires : N(N - 1)/2, soit 2 × 10⁸ comparaisons pour `N = 20 000`.

Ce nombre s'appelle aussi le **nombre d'inversions** d'une permutation ; un tri fusion modifié permet également de le calculer en O(N log N).

Pièges :
- Le résultat peut atteindre N(N - 1)/2 ≈ 2 × 10⁸ : il tient dans un `int` de 32 bits, mais pas de beaucoup ; un `long long` est plus sûr.
- L'arbre de Fenwick s'indexe à partir de `1` : avec l'indice `0`, `i & -i` vaut `0` et la boucle de `ajoute` ne s'arrête jamais.
