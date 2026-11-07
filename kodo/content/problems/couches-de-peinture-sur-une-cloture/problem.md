---
id: couches-de-peinture-sur-une-cloture
title: Couches de peinture sur une clôture
chapter: p3-balayages
order: 2
tags: [sommes-préfixes, listes]
samples: 2
---

## Énoncé
Une clôture est formée de `N` planches numérotées de 1 à `N`. On passe `M` coups de rouleau : le coup `(L, R)` dépose une couche de peinture sur chacune des planches `L` à `R`.

Afficher le plus grand nombre de couches reçues par une planche, le nombre de planches qui ont reçu ce nombre de couches, et le nombre de planches qui n'ont reçu aucune couche.

## Entrée
La première ligne contient `N` et `M`. Chacune des `M` lignes suivantes contient deux entiers `L` et `R`.

## Sortie
Trois entiers sur une ligne : le maximum de couches, le nombre de planches qui l'atteignent, le nombre de planches sans peinture.

## Contraintes
- 1 ≤ N ≤ 200 000
- 1 ≤ M ≤ 8 000
- 1 ≤ L ≤ R ≤ N

## Indices
1. Ajouter 1 à chaque planche de chaque coup de rouleau coûte jusqu'à N × M = 1,6 milliard d'opérations.
2. Plutôt que de modifier toutes les planches d'un coup, noter seulement où la peinture commence et où elle s'arrête.
3. Tableau des différences : `D[L] += 1` et `D[R + 1] -= 1`. Le nombre de couches de la planche `i` est alors `D[1] + D[2] + … + D[i]`.

## Solution
On utilise un **tableau des différences** `D` de taille `N + 2`, rempli de zéros. Pour chaque coup `(L, R)`, on fait `D[L] += 1` et `D[R + 1] -= 1`. Ensuite, on parcourt les planches de 1 à `N` en cumulant : `c = c + D[i]` donne le nombre de couches de la planche `i`. On tient à jour le maximum, le nombre de planches qui l'atteignent et le nombre de zéros.

**Pourquoi.** La somme `D[1] + … + D[i]` reçoit `+1` de chaque coup tel que `L ≤ i`, et `−1` de chaque coup tel que `R + 1 ≤ i`, c'est-à-dire `R < i`. Il reste `+1` exactement pour les coups tels que `L ≤ i ≤ R` : ceux qui couvrent la planche `i`.

**Coût.** Deux opérations par coup, puis un passage sur les planches : environ M + N opérations, contre jusqu'à N × M pour la méthode directe. Le piège : déclarer `D` de taille `N + 1` seulement, alors que l'on écrit en `R + 1`, qui peut valoir `N + 1`.
