---
id: chemins-par-une-case-bonus
title: Chemins par une case bonus
chapter: n4-defis
order: 2
tags: [mathématiques, programmation-dynamique, tri]
samples: 2
---

## Énoncé
Une grille a `H` lignes et `W` colonnes. La case `(l, c)` est à la ligne `l` et à la colonne `c`, numérotées à partir de `1`. On part de la case `(1, 1)` et on va jusqu'à la case `(H, W)` en faisant uniquement des pas vers la droite ou vers le bas.

`K` cases sont des **pièges** : un chemin ne doit passer par aucune. `B` autres cases sont des **bonus**.

Écris un programme qui compte les chemins qui évitent tous les pièges et passent par au moins un bonus. Comme ce nombre peut être énorme, affiche-le modulo `1 000 000 007`.

## Entrée
- La première ligne contient quatre entiers `H`, `W`, `K` et `B`.
- Les `K` lignes suivantes contiennent chacune deux entiers `l` et `c` : un piège.
- Les `B` lignes suivantes contiennent chacune deux entiers `l` et `c` : un bonus.

Toutes ces cases sont différentes, et aucune n'est `(1, 1)` ni `(H, W)`.

## Sortie
Un seul entier : le nombre de chemins, modulo `1 000 000 007`.

## Contraintes
- 1 ≤ H, W ≤ 100 000
- 0 ≤ K + B ≤ 1 500

## Indices
1. Sans aucune case spéciale, le nombre de chemins pour descendre de `a` lignes et avancer de `b` colonnes est le coefficient binomial `C(a + b, a)`. Avec les factorielles et leurs inverses modulo `1 000 000 007`, il se calcule en O(1).
2. Compte plutôt le complémentaire : (chemins qui évitent les pièges) − (chemins qui évitent les pièges **et** les bonus). Il ne reste qu'à savoir compter les chemins qui évitent un ensemble de cases interdites.
3. Trie les cases spéciales. Pour une case `i`, le nombre de chemins de `(1, 1)` à `i` qui n'ont touché aucune case interdite avant est : tous les chemins jusqu'à `i`, moins, pour chaque case interdite `j` avant `i`, les chemins dont la **première** case interdite est `j`.

## Solution
**Compter sans obstacle.** Un chemin de `(l₁, c₁)` à `(l₂, c₂)` est une suite de `l₂ - l₁` pas vers le bas et `c₂ - c₁` pas vers la droite, dans n'importe quel ordre. Il y en a `C(d, l₂ - l₁)` avec `d = (l₂ - l₁) + (c₂ - c₁)`, et `0` si `l₂ < l₁` ou `c₂ < c₁`. On précalcule les factorielles jusqu'à `H + W` et leurs inverses. Le premier inverse s'obtient par le petit théorème de Fermat, `x⁻¹ = x^(p-2) mod p`, et les autres en reculant : `inv[i-1] = inv[i] × i`. Chaque coefficient coûte alors O(1).

**Éviter un ensemble de cases.** Trions les cases interdites par ligne puis par colonne, et ajoutons l'arrivée à la fin. Notons `f[i]` le nombre de chemins de `(1, 1)` à la case `i` qui ne touchent aucune case interdite avant `i`. Un chemin qui en touche au moins une a une **première** case interdite `j`, placée avant `i` dans l'ordre. Ces chemins se comptent par `f[j] × chemins(j → i)`. Donc :

`f[i] = chemins(départ → i) − somme sur j interdite avant i de f[j] × chemins(j → i)`.

**Au moins un bonus.** On fait ce calcul deux fois, dans la même boucle. Une fois où seules les cases pièges sont interdites (`sans_piege`), une fois où pièges et bonus le sont (`sans_rien`). La réponse est `sans_piege[arrivée] − sans_rien[arrivée]`, modulo `1 000 000 007`. En effet, un chemin sans piège soit ne touche aucun bonus, soit en touche au moins un.

Complexité : **O(H + W + (K + B)²)**, environ un million de coefficients binomiaux.

Pourquoi les idées simples échouent : remplir la grille case par case coûte `H × W = 10¹⁰` opérations. Ajouter, pour chaque bonus, les chemins qui passent par lui compte plusieurs fois les chemins qui touchent plusieurs bonus. L'inclusion-exclusion sur tous les sous-ensembles de cases est exponentielle. Le complémentaire et la « première case interdite » évitent ces deux écueils.

Pièges :
- Les soustractions modulo donnent des résultats négatifs en C++ : ajoute `MOD` avant de prendre le reste.
- Les produits de deux nombres inférieurs à `10⁹ + 7` dépassent 2³¹ : utilise `long long` et réduis après chaque multiplication.
- Le tri par (ligne, colonne) garantit que toute case `j` qui peut précéder `i` sur un chemin est placée avant `i`. Il faut quand même tester `colonne(j) ≤ colonne(i)`.
