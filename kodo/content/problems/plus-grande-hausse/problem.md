---
id: plus-grande-hausse
title: Plus grande hausse
chapter: p3-correction
order: 1
tags: [listes]
samples: 2
---

## Énoncé
Le prix d'un objet est relevé pendant `N` jours. On veut l'acheter un jour `i` et le revendre un jour `j` strictement plus tard (`i < j`). Afficher le plus grand gain possible `Pⱼ − Pᵢ`. Ce gain est négatif si le prix baisse tous les jours : il faut quand même acheter puis revendre.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` prix `P₁, …, Pₙ`, dans l'ordre des jours.

## Sortie
Le plus grand gain.

## Contraintes
- 2 ≤ N ≤ 20 000
- 1 ≤ Pᵢ ≤ 1 000 000

## Indices
1. Essayer tous les couples de jours ferait 200 millions de soustractions : trop lent.
2. Si l'on revend le jour `j`, quel est le meilleur jour pour acheter ?
3. Parcourir les jours dans l'ordre en tenant à jour le plus petit prix vu **avant** le jour courant. Quelle propriété cette variable vérifie-t-elle au début de chaque tour ?

## Solution
Si l'on revend le jour `j`, le meilleur achat se fait au prix le plus bas parmi les jours 1 à `j − 1`. On parcourt donc les jours à partir du deuxième, en tenant à jour deux variables :
- `mini`, le plus petit prix parmi les jours déjà dépassés ;
- `meilleur`, le plus grand gain d'une revente avant le jour courant.

Au jour `j`, on compare `P[j] − mini` à `meilleur`, **puis** on met `mini` à jour avec `P[j]`. L'ordre compte : si l'on mettait `mini` à jour d'abord, on pourrait acheter et revendre le même jour, avec un gain nul, faux quand les prix baissent.

**Invariant.** Au début du tour `j`, `mini` est le minimum de `P[1..j − 1]`, et `meilleur` est le gain d'un vrai couple de jours, au moins égal au gain `P[j'] − P[i]` de chaque couple `i < j' < j`. C'est vrai avant le premier tour (`j = 2`), en initialisant `mini = P[1]` et `meilleur = P[2] − P[1]`, le gain du couple de jours (1, 2). Un tour le conserve : les nouveaux couples sont ceux où l'on revend le jour `j`, et le meilleur d'entre eux est `P[j] − mini`. À la fin des `N − 1` tours, `meilleur` est le gain d'un couple, au moins égal à celui de tous les couples : c'est le plus grand gain.

**Terminaison et coût.** La boucle `for` fait exactement `N − 1` tours, avec un nombre constant d'opérations chacun. C'est bien moins que les `N × (N − 1) / 2` couples de la méthode naïve. Le piège : initialiser `meilleur` à 0, ce qui donne une réponse fausse quand le prix ne fait que baisser.
