---
id: plus-petit-ecart-sur-un-cercle
title: Plus petit écart sur un cercle
chapter: p3-synthese
order: 1
tags: [tri, mathématiques]
samples: 3
---

## Énoncé
Une piste circulaire mesure C mètres. Une position sur la piste est repérée par la distance parcourue depuis la ligne de départ, dans le sens de la course : c'est un entier de 0 à C − 1. N coureurs sont arrêtés sur la piste. La **distance** entre deux coureurs est la longueur du plus court des deux arcs qui les relient. Par exemple, sur une piste de 100 mètres, les positions 5 et 95 sont à distance 10.

Trouver la plus petite distance entre deux coureurs, et le nombre de paires de coureurs qui sont à cette distance.

## Entrée
La première ligne contient N et C. La deuxième ligne contient les N positions.

## Sortie
Deux entiers sur une ligne : la plus petite distance, puis le nombre de paires de coureurs à cette distance.

## Contraintes
- 2 ≤ N ≤ 15 000
- 1 ≤ C ≤ 10⁹
- 0 ≤ position < C. Plusieurs coureurs peuvent être à la même position.

## Indices
1. Après avoir trié les positions, les deux coureurs les plus proches sont forcément voisins dans l'ordre du tour de piste. Sans oublier le dernier et le premier, qui sont voisins en passant par la ligne de départ.
2. Si deux coureurs sont à la même position, la plus petite distance est 0, et toutes les paires de coureurs d'une même position comptent.
3. Avec seulement deux coureurs, les deux arcs relient la même paire : elle ne doit être comptée qu'une fois.

## Solution
On trie les positions p₀ ≤ p₁ ≤ … ≤ p_{N−1}. Les **écarts** entre voisins sont g_i = p_{i+1} − p_i pour i < N − 1, et l'écart de bouclage g_{N−1} = C − (p_{N−1} − p₀), qui passe par la ligne de départ. Ces N écarts ont pour somme C.

**Cas avec des positions égales.** Si un écart vaut 0, la plus petite distance est 0. Les paires à distance 0 sont les paires de coureurs à la même position : un groupe de k coureurs au même endroit en donne k(k − 1)/2. Ces groupes sont des blocs consécutifs de la liste triée.

**Cas N ≥ 3 sans position égale.** Deux coureurs non voisins sont séparés, dans chaque sens, par au moins deux écarts non nuls, donc leur distance est au moins le double du plus petit écart. Le minimum est donc atteint par des voisins. Le plus petit écart d vaut au plus C/3 (trois écarts au moins, de somme C), donc d ≤ C − d, et la distance entre ces voisins vaut bien d. La réponse est d, et le nombre d'écarts égaux à d : chacun correspond à une paire différente, et aucune paire non voisine n'est à distance d.

**Cas N = 2.** Une seule paire, à distance min(g₀, C − g₀). On répond cette distance et 1.

**Coût.** Le tri coûte O(N log N), le reste O(N). Tester toutes les paires coûterait O(N²), environ 10⁸ comparaisons : trop pour Python.
