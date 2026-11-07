---
id: bilan-d-une-saison
title: Bilan d'une saison
chapter: p1-booleens
order: 8
synthesis: true
tags: [conditions, boucles, simulation]
samples: 2
---

## Énoncé
Une équipe a joué `N` matchs. Pour chacun, on connaît le nombre de buts marqués `M` et le nombre de buts encaissés `E`. Une victoire (`M > E`) rapporte 3 points, un match nul 1 point, une défaite 0 point. Afficher :
- le nombre total de points ;
- la plus longue série de matchs consécutifs sans défaite ;
- le nombre de victoires obtenues sans encaisser de but.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune deux entiers `M` et `E`, dans l'ordre des matchs.

## Sortie
Trois lignes : le nombre de points, la longueur de la plus longue série sans défaite, puis le nombre de victoires sans but encaissé.

## Contraintes
- 1 ≤ N ≤ 1 000
- 0 ≤ M, E ≤ 20

## Indices
1. Pour chaque match, on peut calculer deux booléens : `victoire = M > E` et `defaite = M < E`. Un match nul n'est ni l'un ni l'autre.
2. La série sans défaite fonctionne comme une série en cours : elle augmente de 1 après une victoire ou un nul, et revient à 0 après une défaite.
3. Une victoire sans but encaissé : `victoire and E == 0`.

## Solution
On lit les matchs un par un et on tient à jour quatre variables : `points`, `serie` (la série sans défaite en cours), `record` (la plus longue série) et `nettes` (les victoires sans but encaissé).

Pour chaque match :
- si `M > E`, on ajoute 3 points ; si `M == E`, on ajoute 1 point ;
- si `M >= E` (pas de défaite), `serie` augmente de 1 et on met à jour `record` ; sinon, `serie` revient à 0 ;
- si `M > E and E == 0`, on augmente `nettes`.

Les pièges : un match nul **prolonge** la série sans défaite (il n'est pas une défaite) ; un match `0 0` est un nul, pas une victoire sans but encaissé ; et le record doit être mis à jour pendant la série, pour ne pas oublier une série qui dure jusqu'au dernier match.
