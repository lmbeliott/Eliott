---
id: sommes-et-produits-de-tous-les-sous-ensembles
title: Sommes et produits de tous les sous-ensembles
chapter: p3-complexite
order: 2
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
On dispose de N nombres a₁, a₂, …, a_N. On choisit un **sous-ensemble** non vide de ces nombres (n'importe quel choix d'au moins un des N nombres) ; il y en a 2^N − 1. Calculer :

- la somme, sur tous les sous-ensembles non vides, de la somme de leurs éléments ;
- la somme, sur tous les sous-ensembles non vides, du produit de leurs éléments.

Par exemple, avec 1, 2 et 3, les sous-ensembles non vides sont {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3} et {1, 2, 3}. La somme des sommes vaut 1 + 2 + 3 + 3 + 4 + 5 + 6 = 24, et la somme des produits vaut 1 + 2 + 3 + 2 + 3 + 6 + 6 = 23.

Les résultats étant très grands, on les donne modulo 1 000 000 007. Deux nombres égaux à des positions différentes sont considérés comme différents.

## Entrée
La première ligne contient N. La deuxième ligne contient les N nombres.

## Sortie
Deux lignes : la somme des sommes, puis la somme des produits, chacune modulo 1 000 000 007.

## Contraintes
- 1 ≤ N ≤ 20 000
- 0 ≤ aᵢ ≤ 10⁹

## Indices
1. Énumérer les 2^N sous-ensembles est impossible dès que N dépasse 25 environ. Il faut compter autrement.
2. Pour la somme des sommes : dans combien de sous-ensembles le nombre aᵢ apparaît-il ?
3. Pour la somme des produits : développer le produit (1 + a₁)(1 + a₂)…(1 + a_N). Chaque terme du développement correspond à un sous-ensemble.

## Solution
**Somme des sommes.** Plutôt que de parcourir les sous-ensembles, on compte la **contribution** de chaque nombre. Le nombre aᵢ appartient à 2^(N−1) sous-ensembles : pour chacun des N − 1 autres nombres, on choisit librement de le prendre ou non. La somme des sommes vaut donc (a₁ + a₂ + … + a_N) × 2^(N−1). Dans l'exemple : 6 × 4 = 24.

**Somme des produits.** En développant (1 + a₁)(1 + a₂)…(1 + a_N), on choisit dans chaque parenthèse soit 1, soit aᵢ : chaque choix correspond au sous-ensemble des aᵢ choisis, et donne le produit de ses éléments. Le développement vaut donc la somme des produits de tous les sous-ensembles, y compris le sous-ensemble vide, dont le produit vaut 1. La réponse est (1 + a₁)(1 + a₂)…(1 + a_N) − 1. Dans l'exemple : 2 × 3 × 4 − 1 = 23.

**Calcul modulo 1 000 000 007.** On réduit après chaque addition et chaque multiplication : le reste d'une somme ou d'un produit ne dépend que des restes des termes. Après la soustraction finale, on ajoute le modulo si le résultat est négatif (en C++, `-1 % m` vaut `-1`). 2^(N−1) se calcule avec une boucle de N − 1 multiplications par 2.

**Coût.** Une boucle sur les N nombres : O(N), au lieu de O(N × 2^N) pour l'énumération. En C++, les produits de deux restes atteignent 10¹⁸ : il faut des `long long`.
