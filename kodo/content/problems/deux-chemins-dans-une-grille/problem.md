---
id: deux-chemins-dans-une-grille
title: Deux chemins dans une grille
chapter: n4-dynamique
order: 8
tags: [programmation-dynamique, grilles]
samples: 3
---

## Énoncé
Une grille a `R` lignes et `C` colonnes : chaque case est interdite, ou contient un chiffre de `0` à `9`. Un **chemin** part de la case en haut à gauche et arrive à la case en bas à droite ; à chaque mouvement, il va vers la case de droite ou vers la case du dessous, sans jamais passer sur une case interdite.

On choisit **deux** chemins, qui peuvent se croiser, avoir des cases en commun ou même être identiques. Leur **valeur** est la somme des chiffres de toutes les cases visitées par au moins un des deux chemins : une case visitée par les deux chemins ne compte qu'une fois.

Écris un programme qui calcule la plus grande valeur possible de deux chemins.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes, de haut en bas, contiennent chacune `C` caractères : un chiffre de `0` à `9`, ou `#` pour une case interdite.

## Sortie
Un seul entier : la plus grande valeur de deux chemins, ou `-1` s'il n'existe aucun chemin.

## Contraintes
- 1 ≤ R, C ≤ 100

## Indices
1. Prendre le meilleur chemin, puis le meilleur chemin parmi les chiffres qui restent, ne marche pas : regarde le deuxième exemple. Il faut choisir les deux chemins **ensemble**.
2. Fais avancer les deux chemins **en même temps**, un mouvement chacun. Après `s` mouvements, chaque chemin est sur une case dont la ligne plus la colonne vaut `s` : il suffit de connaître les deux lignes.
3. Une case `(i, j)` est toujours atteinte après exactement `i + j` mouvements. Si les deux chemins passent par une même case, ils y sont donc au même moment : avec les deux chemins synchronisés, les cases communes se repèrent facilement.

## Solution
**Pourquoi un glouton échoue.** Sur le deuxième exemple, le meilleur chemin seul vaut `0 + 6 + 2 + 8 + 4 = 20`. Après lui, il reste le `2` en haut à droite et le `5` en bas au milieu, qu'aucun chemin ne peut prendre tous les deux : on obtient `25`. Pourtant, les chemins `0 6 2 5 4` (bas, droite, bas, droite) et `0 0 2 8 4` (droite, droite, bas, bas) visitent toutes les cases sauf le `0` en bas à gauche, pour une valeur de `27`, la somme de toute la grille.

**Avancer en même temps.** Numérotons lignes et colonnes à partir de `0`. Une case `(i, j)` est atteinte après exactement `i + j` mouvements, quel que soit le chemin. On fait donc avancer les deux chemins ensemble : après `s` mouvements, le premier est en `(i₁, s − i₁)` et le second en `(i₂, s − i₂)`. Deux chemins passent par une même case si et seulement si, à un certain moment `s`, ils ont la même ligne `i₁ = i₂`. On n'a donc pas besoin de retenir les cases déjà visitées : il suffit de ne compter qu'une fois la case quand `i₁ = i₂`.

**La programmation dynamique.** On note `meilleur[s][i₁][i₂]` la plus grande valeur des débuts de chemins après `s` mouvements, le premier sur la ligne `i₁` et le second sur la ligne `i₂`. Par symétrie, on peut imposer `i₁ ≤ i₂`. Chaque chemin vient de la case du dessus (ligne `i − 1`) ou de celle de gauche (même ligne) : il y a quatre états précédents possibles.

`meilleur[s][i₁][i₂] = max des quatre meilleur[s − 1][p₁][p₂] + chiffre(i₁, s − i₁) + (chiffre(i₂, s − i₂) si i₂ ≠ i₁)`

Les états dont une case est interdite ou hors de la grille sont impossibles. Au départ, `meilleur[0][0][0]` vaut le chiffre de la case en haut à gauche ; la réponse est `meilleur[R + C − 2][R − 1][R − 1]`, ou `-1` si cet état est impossible. On ne garde que la couche `s − 1` pour calculer la couche `s`.

**Complexité.** Il y a `R + C − 1` couches d'au plus `R × (R + 1) / 2` états, chacun calculé à partir de 4 états : environ 10⁶ états pour une grille `100 × 100`, soit **O((R + C) × R²)**.

**Pourquoi la solution naïve est trop lente.** Une grille `100 × 100` a plus de 10⁵⁸ chemins : essayer tous les couples est impossible. Une programmation dynamique sur les deux cases `(i₁, j₁, i₂, j₂)` sans synchroniser les chemins ne sait pas repérer les cases communes, et elle a 10⁸ états.

**Pièges.**
- Quand `i₁ = i₂`, les deux chemins sont sur la même case : son chiffre ne compte qu'une fois. Le premier exemple n'a qu'un chemin possible (le `4` est dans une impasse), et la réponse est `11`, pas `22`.
- Si la case de départ ou d'arrivée est interdite, ou si aucun chemin ne traverse la grille, la réponse est `-1` (troisième exemple).
- Avec `i₁ ≤ i₂`, l'état précédent `(p₁, p₂)` peut avoir `p₁ > p₂` (quand `i₁ = i₂`) : range-le comme `(min, max)`.
