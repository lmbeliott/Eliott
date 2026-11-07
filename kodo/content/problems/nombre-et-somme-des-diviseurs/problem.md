---
id: nombre-et-somme-des-diviseurs
title: Nombre et somme des diviseurs
chapter: p4-arithmetique
order: 2
tags: [arithmétique, mathématiques]
samples: 1
---

## Énoncé
Pour un entier N ≥ 1, afficher son nombre de diviseurs et la somme de ses diviseurs. Par exemple, 12 a pour diviseurs 1, 2, 3, 4, 6 et 12 : il en a 6, de somme 28.

Chaque test contient T questions.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient un entier N.

## Sortie
T lignes : pour chaque N, son nombre de diviseurs et la somme de ses diviseurs, séparés par une espace.

## Contraintes
- 1 ≤ T ≤ 4
- 1 ≤ N ≤ 10¹²

## Indices
1. Essayer tous les diviseurs possibles de 1 à N coûte 10¹² opérations. Il faut d'abord décomposer N en facteurs premiers.
2. Pour décomposer N, on essaie les diviseurs d = 2, 3, 4, … tant que d × d ≤ N, en divisant N par d autant de fois que possible. Ce qui reste à la fin, s'il est plus grand que 1, est premier.
3. Si N = p₁^e₁ × … × p_k^e_k, le nombre de diviseurs est (e₁ + 1) × … × (e_k + 1), et leur somme est le produit des (1 + pᵢ + pᵢ² + … + pᵢ^eᵢ).

## Solution
**Décomposer.** On essaie d = 2, 3, 4, … tant que d × d ≤ N (où N est la valeur courante, qu'on divise au fur et à mesure). Quand d divise N, on le divise autant de fois que possible et on note l'exposant. Un d qui divise N à ce moment est forcément premier : ses facteurs premiers, plus petits, ont déjà été retirés. À la fin, si le reste N est plus grand que 1, il est premier : un nombre composé a un facteur premier au plus égal à sa racine carrée, qui aurait été trouvé. On peut ne tester que 2 puis les nombres impairs.

**Les formules.** Si N = p₁^e₁ × … × p_k^e_k, un diviseur de N s'écrit p₁^f₁ × … × p_k^f_k avec 0 ≤ fᵢ ≤ eᵢ, et chaque choix des exposants donne un diviseur différent (unicité de la décomposition). Il y a donc (e₁ + 1) × … × (e_k + 1) diviseurs. En développant le produit des sommes (1 + pᵢ + … + pᵢ^eᵢ), on obtient exactement une fois chaque diviseur : c'est leur somme.

**Coût.** Au plus √N ≈ 10⁶ divisions par question, la moitié en ne testant que les impairs. Énumérer les diviseurs de 1 à N serait impossible. La somme des diviseurs reste inférieure à 5 × 10¹² : `long long` en C++.
