---
id: total-d-un-ticket-de-caisse
title: Total d'un ticket de caisse
chapter: p1-lecture
order: 5
tags: [entrées-sorties, boucles, arithmétique]
samples: 2
---

## Énoncé
Un ticket de caisse a `N` lignes. Chaque ligne indique une quantité `Q` et un prix unitaire `P` en centimes : on a acheté `Q` fois un article qui coûte `P` centimes. Afficher le nombre total d'articles achetés, puis le montant total à payer en centimes.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune deux entiers `Q` et `P` séparés par une espace.

## Sortie
Deux lignes : le nombre total d'articles, puis le montant total en centimes.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ Q ≤ 100
- 1 ≤ P ≤ 10 000

## Indices
1. Chaque ligne du ticket contient deux nombres : dans la boucle, on lit les deux à la fois.
2. Il faut deux accumulateurs : un pour les articles, un pour le montant.
3. Une ligne du ticket coûte `Q × P` centimes et compte pour `Q` articles, pas pour un seul.

## Solution
On lit `N`, puis on fait `N` tours de boucle. À chaque tour, on lit `Q` et `P` sur la même ligne, on ajoute `Q` au nombre d'articles et `Q × P` au montant. Après la boucle, on affiche les deux totaux.

Le piège est de compter une ligne du ticket comme un seul article : une ligne `3 250` représente trois articles, pour 750 centimes.

Le montant reste inférieur à 1 000 × 100 × 10 000 = 10⁹, ce qui tient dans un `int` en C++.
