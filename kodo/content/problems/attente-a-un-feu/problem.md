---
id: attente-a-un-feu
title: Attente à un feu
chapter: p1-synthese
order: 2
tags: [arithmétique, conditions]
samples: 2
---

## Énoncé
Un feu de circulation passe au vert à l'instant `0`, reste vert pendant `V` secondes, puis rouge pendant `R` secondes, puis recommence : vert de `V + R` à `2V + R`, et ainsi de suite. À l'instant exact où il change, il prend déjà sa nouvelle couleur.

`N` voitures arrivent au feu, chacune à un instant donné. Une voiture qui arrive au vert passe sans attendre ; une voiture qui arrive au rouge attend le prochain passage au vert. Afficher le temps d'attente total de toutes les voitures.

## Entrée
- La première ligne contient deux entiers `V` et `R`.
- La deuxième ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient un entier `T` : l'instant d'arrivée d'une voiture, en secondes.

## Sortie
Un seul entier : la somme des temps d'attente, en secondes.

## Contraintes
- 1 ≤ V, R ≤ 1 000
- 1 ≤ N ≤ 1 000
- 0 ≤ T ≤ 10⁹

## Indices
1. Le feu se répète toutes les `V + R` secondes. Ce qui compte, c'est la position de `T` dans le cycle : `T % (V + R)`.
2. Si cette position `p` est inférieure à `V`, le feu est vert. Sinon, il est rouge, et il repasse au vert à la fin du cycle, `V + R - p` secondes plus tard.
3. Vérifier les instants de changement : avec `V = 30` et `R = 20`, une voiture qui arrive à `30` attend 20 secondes, et une voiture qui arrive à `50` n'attend pas.

## Solution
Le feu est **périodique** : il refait la même chose toutes les `V + R` secondes. On ramène donc chaque instant d'arrivée dans le premier cycle avec `p = T % (V + R)`, un nombre entre `0` et `V + R - 1`.

- Si `p < V`, le feu est vert : l'attente est 0.
- Sinon, le feu est rouge et repasse au vert à la position `V + R` du cycle : l'attente est `V + R - p`.

Les instants de changement suivent l'énoncé : pour `p = V`, le feu vient de passer au rouge, et l'attente vaut `R` ; pour `p = 0`, il vient de passer au vert, et l'attente vaut 0.

Simuler le feu seconde par seconde jusqu'à `T` serait beaucoup trop lent quand `T` vaut 10⁹ : le reste `%` remplace cette boucle par un seul calcul.
