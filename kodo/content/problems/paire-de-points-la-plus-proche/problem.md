---
id: paire-de-points-la-plus-proche
title: Paire de points la plus proche
chapter: p4-diviser-regner
order: 7
tags: [récursivité, tri, mathématiques]
samples: 2
time_limit_ms: 500
---

## Énoncé
On donne N points du plan, à coordonnées entières ; plusieurs points peuvent être confondus. Afficher le **carré** de la plus petite distance entre deux de ces points, c'est-à-dire la plus petite valeur de (xᵢ − x_j)² + (yᵢ − y_j)² pour i ≠ j.

Les coordonnées sont fabriquées par une formule, pour que l'entrée reste courte : u₁ = X, puis u_{k+1} = (u_k × B + C) mod M. Le point i a pour coordonnées (u_{2i−1}, u_{2i}). Par exemple, avec N = 3, X = 1, B = 2, C = 3 et M = 10, la suite u commence par 1, 5, 3, 9, 1, 5 : les points sont (1, 5), (3, 9) et (1, 5), et la réponse est 0.

## Entrée
Une seule ligne : les cinq entiers N, X, B, C et M.

## Sortie
Le carré de la plus petite distance entre deux points.

## Contraintes
- 2 ≤ N ≤ 70 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Indices
1. Trier les points par abscisse, et couper en deux moitiés par une droite verticale. La meilleure paire est dans la moitié gauche, dans la moitié droite, ou à cheval.
2. Soit d le meilleur carré de distance trouvé dans les deux moitiés. Une paire à cheval plus proche a ses deux points dans une **bande** verticale autour de la droite de coupe, d'abscisse à moins de √d de la droite.
3. Dans la bande, rangée par ordonnée croissante, chaque point n'a besoin d'être comparé qu'aux points suivants tant que l'écart d'ordonnée reste inférieur à √d : il y en a au plus 7.

## Solution
**Diviser.** On trie les points par abscisse. La fonction récursive reçoit une liste de points triés par abscisse et renvoie le plus petit carré de distance de la liste, ainsi que la liste triée par ordonnée. Pour 3 points ou moins, on compare toutes les paires. Sinon, on coupe au milieu : xm est l'abscisse du point du milieu, et on appelle la fonction sur les deux moitiés. Soit d le minimum des deux résultats.

**La bande.** Une paire à cheval à distance au carré strictement inférieure à d a ses deux points à moins de √d de la droite x = xm, horizontalement : on garde dans la **bande** les points tels que (x − xm)² < d. En fusionnant les deux moitiés déjà triées par ordonnée (comme dans le tri fusion), on obtient la bande triée par ordonnée sans nouveau tri. Pour chaque point de la bande, on le compare aux points suivants de la bande, et on s'arrête dès que l'écart d'ordonnée au carré atteint d : les points plus loin dans la liste sont encore plus éloignés verticalement.

**Pourquoi c'est rapide.** Si d = 0, la bande est vide. Sinon, les points de la bande dont l'ordonnée est entre y et y + √d tiennent dans un rectangle de largeur 2√d et de hauteur √d, qu'on découpe en 8 carrés de côté √d / 2, quatre de chaque côté de la droite. Deux points d'une même moitié sont à distance au carré au moins d, par définition de d ; or deux points d'un même petit carré sont à distance au carré au plus d / 2. Chaque petit carré contient donc au plus un point, et la boucle intérieure fait au plus 7 tours. Chaque niveau de récursion coûte O(N), et il y a log₂ N niveaux : O(N log N) en tout. Comparer toutes les paires coûterait N²/2 = 2,5 × 10⁹ calculs de distance. Le carré d'une distance atteint 2 × 10¹⁸ : `long long` en C++.
