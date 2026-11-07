---
id: variation-d-un-solde-entre-deux-jours
title: Variation d'un solde entre deux jours
chapter: p3-balayages
order: 1
tags: [sommes-préfixes, listes]
samples: 2
---

## Énoncé
Un compte enregistre un mouvement par jour pendant `N` jours : le jour `i`, le solde change de `Mᵢ` euros (positif pour un dépôt, négatif pour un retrait). Répondre à `Q` questions : pour deux jours `L ≤ R`, de combien le solde a-t-il changé en tout du jour `L` au jour `R` inclus ? Autrement dit, que vaut `M_L + … + M_R` ?

## Entrée
La première ligne contient `N` et `Q`. La deuxième ligne contient `M₁, …, M_N`. Chacune des `Q` lignes suivantes contient deux entiers `L` et `R`.

## Sortie
`Q` lignes : la réponse à chaque question, dans l'ordre.

## Contraintes
- 1 ≤ N ≤ 50 000
- 1 ≤ Q ≤ 10 000
- -999 ≤ Mᵢ ≤ 999
- 1 ≤ L ≤ R ≤ N

## Indices
1. Additionner les mouvements de `L` à `R` pour chaque question coûte jusqu'à N opérations par question : jusqu'à 500 millions en tout.
2. Calculer une fois pour toutes `P[i] = M₁ + … + Mᵢ`, avec `P[0] = 0`.
3. La somme de `L` à `R` est la différence de deux valeurs de `P`.

## Solution
On calcule le tableau des **sommes préfixes** : `P[0] = 0` et `P[i] = P[i − 1] + Mᵢ`, si bien que `P[i]` est la somme des `i` premiers mouvements. Pour une question `(L, R)`, on a `P[R] = (M₁ + … + M_{L−1}) + (M_L + … + M_R) = P[L − 1] + (M_L + … + M_R)`, donc la réponse est `P[R] − P[L − 1]`.

**Coût.** N additions pour construire `P`, puis une soustraction par question : environ N + Q opérations, au lieu de N × Q, jusqu'à 500 millions, pour la méthode directe. Le piège est l'indice : avec `P[0] = 0`, la réponse est `P[R] − P[L − 1]`, et le cas `L = 1` ne demande aucun traitement à part.
