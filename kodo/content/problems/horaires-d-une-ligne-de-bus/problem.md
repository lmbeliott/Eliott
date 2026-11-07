---
id: horaires-d-une-ligne-de-bus
title: Horaires d'une ligne de bus
chapter: p1-variables
order: 4
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Le premier bus d'une ligne part à 6 h 00, puis un bus part toutes les 25 minutes. Afficher les heures de départ des 40 premiers bus de la journée.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
40 lignes, dans l'ordre. Chaque ligne contient l'heure puis les minutes du départ, séparées par une espace. Les trois premières lignes sont `6 0`, `6 25` et `6 50`, la quatrième est `7 15`.

## Indices
1. Il est plus simple de compter le temps en minutes depuis minuit : 6 h 00, c'est 360 minutes.
2. Une variable `t` part de 360 et augmente de 25 à chaque bus.
3. Pour retrouver l'heure et les minutes à partir de `t`, utiliser le quotient et le reste de la division par 60.

## Solution
On représente une heure de la journée par un seul nombre : le nombre de minutes écoulées depuis minuit. Le premier départ est à `t = 360`. Pour chacun des 40 bus, on affiche `t // 60` (le nombre d'heures entières) et `t % 60` (les minutes restantes), puis on ajoute 25 à `t`.

Par exemple, le quatrième bus part à t = 360 + 3 × 25 = 435 minutes : 435 // 60 = 7 et 435 % 60 = 15, soit 7 h 15. Le dernier part à 360 + 39 × 25 = 1335 minutes, soit `22 15`.

Ajouter 25 aux minutes et gérer soi-même le passage à l'heure suivante est possible, mais demande des conditions ; avec une seule variable en minutes, le quotient et le reste font ce travail automatiquement. C'est une technique très courante : on choisit l'unité la plus petite pour calculer, et on ne convertit qu'au moment d'afficher.
