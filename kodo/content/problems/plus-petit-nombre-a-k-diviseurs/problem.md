---
id: plus-petit-nombre-a-k-diviseurs
title: Plus petit nombre à K diviseurs
chapter: p4-synthese
order: 7
tags: [arithmétique, backtracking, mathématiques]
samples: 2
---

## Énoncé
Pour chacun des `T` entiers `K` donnés, afficher le plus petit entier strictement positif qui a exactement `K` diviseurs.

Par exemple, 12 a six diviseurs (1, 2, 3, 4, 6, 12) et aucun entier plus petit n'en a exactement six.

## Entrée
- La première ligne contient `T`.
- Chacune des `T` lignes suivantes contient un entier `K`.

## Sortie
`T` lignes : pour chaque `K`, le plus petit entier qui a exactement `K` diviseurs.

## Contraintes
- 1 ≤ T ≤ 3 000
- 1 ≤ K ≤ 10⁶
- on garantit que chaque réponse est au plus 10¹⁸

## Indices
1. Si `n = p₁^e₁ × p₂^e₂ × … × p_r^e_r`, son nombre de diviseurs est `(e₁ + 1)(e₂ + 1)…(e_r + 1)`.
2. Pour la plus petite réponse, les nombres premiers utilisés sont les premiers : 2, 3, 5, 7…, et les exposants vont en décroissant. Échanger deux exposants le montre.
3. Explorer les exposants de 2, puis de 3, puis de 5… avec un retour sur trace : chaque exposant `e` doit être au plus le précédent, `e + 1` doit diviser ce qui reste de `K`, et l'on abandonne dès que le nombre construit dépasse la meilleure réponse connue.

## Solution
**Nombre de diviseurs.** Un diviseur de `n = p₁^e₁ × … × p_r^e_r` s'écrit `p₁^f₁ × … × p_r^f_r` avec `0 ≤ f_i ≤ e_i` : il y en a `(e₁ + 1) × … × (e_r + 1)`.

**Forme de la réponse.** Soit `n` la plus petite réponse. *Ses nombres premiers sont les plus petits* : si `n` utilise un premier `q` mais pas un premier `p < q`, remplacer `q` par `p` garde les exposants, donc le nombre de diviseurs, et diminue `n`. *Ses exposants décroissent* : si `p < q` avec un exposant de `p` plus petit que celui de `q`, échanger les deux exposants garde le nombre de diviseurs et diminue `n` (on multiplie par `(p/q)^(différence)`, plus petit que 1). Donc `n = 2^e₁ × 3^e₂ × 5^e₃ × …` avec `e₁ ≥ e₂ ≥ e₃ ≥ …`. Comme le produit des 16 premiers nombres premiers dépasse 10¹⁸, au plus 15 premiers servent : 2, 3, …, 47.

**Exploration.** Un **retour sur trace** choisit l'exposant de 2, puis celui de 3, etc. On garde `reste`, la partie de `K` encore à obtenir : un exposant `e` n'est possible que si `e + 1` divise `reste`, et il ne dépasse pas l'exposant précédent. Quand `reste = 1`, le nombre construit a exactement `K` diviseurs. **Élagage** : dès que le nombre construit atteint la meilleure réponse trouvée, augmenter l'exposant ou continuer ne peut que l'agrandir, on arrête cette branche.

**Complexité.** Les branches sont peu nombreuses : des exposants décroissants, dont les `e + 1` divisent `K`, avec un produit au plus 10¹⁸. En pratique quelques centaines de nœuds par question. Essayer les entiers un par un est impossible : la réponse dépasse souvent 10¹⁷.

**Pièges.** En C++, tester `valeur > (meilleur − 1) / p` **avant** de multiplier, sinon le produit déborde. `K = 1` donne `1`. Quand `K` est premier, la seule forme possible est `2^(K − 1)`.
