---
id: plus-petit-retard-maximal
title: Plus petit retard maximal
chapter: p4-gloutons
order: 4
tags: [glouton, tri]
samples: 2
---

## Énoncé
Une imprimante doit traiter N commandes, une à la fois, sans pause, à partir de l'instant 0. La commande i dure pᵢ minutes et devrait être finie à l'instant dᵢ. Si elle se termine à l'instant C, son **retard** vaut C − dᵢ si C > dᵢ, et 0 sinon.

Afficher le plus petit retard maximal possible, en choisissant bien l'ordre des commandes : on veut que le plus grand des N retards soit le plus petit possible.

## Entrée
La première ligne contient N. Chacune des N lignes suivantes contient deux entiers pᵢ et dᵢ.

## Sortie
Le plus petit retard maximal.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ pᵢ ≤ 1 000
- 0 ≤ dᵢ ≤ 10⁷

## Indices
1. Commencer par les commandes les plus courtes ne marche pas : avec une commande de 10 minutes à finir à l'instant 10 et une commande de 1 minute à finir à l'instant 20, il faut faire la longue d'abord.
2. Regarder deux commandes qui se suivent dans un ordre donné. Si la première a une date limite plus tardive que la seconde, que se passe-t-il quand on les échange ?
3. Trier par date limite croissante, puis calculer les retards dans cet ordre.

## Solution
**Le glouton.** On traite les commandes par date limite croissante, et on calcule les instants de fin successifs et le plus grand retard.

**Argument d'échange.** Prenons un ordre quelconque, et deux commandes voisines i puis j avec dᵢ > d_j : une **inversion** par rapport au tri. Si t est l'instant où i commence, j finit à t + pᵢ + p_j, avec un retard au moins t + pᵢ + p_j − d_j. Échangeons-les. Les autres commandes ne bougent pas. Maintenant j finit à t + p_j, plus tôt qu'avant, donc son retard ne peut que diminuer ; et i finit à t + pᵢ + p_j, avec un retard d'au plus max(0, t + pᵢ + p_j − dᵢ), qui est au plus l'ancien retard de j puisque dᵢ > d_j. Le retard maximal n'augmente donc pas. Chaque échange diminue d'une unité le nombre d'inversions ; en partant d'un ordre optimal et en échangeant tant qu'il reste deux voisines mal rangées (comme le tri à bulles), on arrive à l'ordre par date limite sans jamais augmenter le retard maximal : cet ordre est optimal. Les commandes de même date limite peuvent être rangées dans n'importe quel ordre : l'échange de deux telles commandes ne change pas le retard maximal, par le même calcul.

**Coût.** O(N log N) pour le tri, puis un passage. Essayer tous les ordres coûterait N! : déjà 3,6 millions pour N = 10.
