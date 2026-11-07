---
id: eclairer-le-plus-long-troncon
title: Éclairer le plus long tronçon
chapter: p3-balayages
order: 8
synthesis: true
tags: [sommes-préfixes, deux-pointeurs]
samples: 2
---

## Énoncé
Une route compte `L` positions numérotées de 1 à `L`. `N` lampadaires y sont installés : le lampadaire `i` éclaire toutes les positions de `Aᵢ` à `Bᵢ`. Une position est **sombre** si aucun lampadaire ne l'éclaire.

On dispose en plus de `K` lampes portatives ; chacune peut éclairer une seule position, au choix. Trouver le plus long tronçon de positions consécutives que l'on peut rendre entièrement éclairé. Afficher sa longueur et sa première position ; en cas d'égalité, choisir le tronçon le plus à gauche.

## Entrée
La première ligne contient `L`, `N` et `K`. Chacune des `N` lignes suivantes contient deux entiers `Aᵢ` et `Bᵢ`.

## Sortie
Deux entiers sur une ligne : la longueur du tronçon, puis sa première position.

## Contraintes
- 1 ≤ L ≤ 300 000
- 1 ≤ N ≤ 8 000
- 0 ≤ K ≤ L
- 1 ≤ Aᵢ ≤ Bᵢ ≤ L

## Indices
1. Deux étapes : trouver les positions sombres, puis le plus long tronçon qui contient au plus `K` positions sombres.
2. Pour la première étape, marquer chaque position de chaque lampadaire peut coûter N × L = 2,4 milliards d'opérations. Un tableau des différences donne le nombre de lampadaires qui éclairent chaque position en un seul passage.
3. Pour la seconde, une fenêtre glissante : la fin avance d'une position à la fois, et le début avance tant que la fenêtre contient plus de `K` positions sombres.

## Solution
**Étape 1 : les positions sombres.** Tableau des différences `D` de taille `L + 2` : pour chaque lampadaire, `D[Aᵢ] += 1` et `D[Bᵢ + 1] −= 1`. En cumulant `D[1] + … + D[p]`, on obtient le nombre de lampadaires qui éclairent la position `p` : elle est sombre si ce nombre vaut 0. Cela coûte N + L opérations.

**Étape 2 : la plus longue fenêtre.** Un tronçon peut être entièrement éclairé si et seulement s'il contient au plus `K` positions sombres : on place une lampe sur chacune. On fait glisser une fenêtre `[g, d]` en comptant ses positions sombres. Pour chaque fin `d` de 1 à `L`, on ajoute la position `d`, puis, tant que la fenêtre contient plus de `K` positions sombres, on retire la position `g` et on avance `g`. La fenêtre `[g, d]` est alors le plus long tronçon valide qui finit en `d` : un tronçon contenu dans un tronçon valide est valide, donc quand `d` avance, le plus petit début valide ne recule jamais. On garde la fenêtre si elle est **strictement** plus longue que la meilleure, ce qui donne la plus à gauche en cas d'égalité.

**Coût.** Environ N + 3L opérations, soit environ un million. La méthode directe (marquer les positions une par une, puis essayer chaque début) peut demander des milliards d'opérations. Les pièges : oublier la case `L + 1` du tableau des différences, et le cas `K = 0`, où le tronçon doit être déjà entièrement éclairé.
