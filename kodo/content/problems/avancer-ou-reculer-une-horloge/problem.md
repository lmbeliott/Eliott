---
id: avancer-ou-reculer-une-horloge
title: Avancer ou reculer une horloge
chapter: p2-nombres
order: 4
tags: [arithmétique]
samples: 2
---

## Énoncé
Une horloge indique `H` heures et `M` minutes, sur un cadran de 24 heures (après 23 h 59 vient 0 h 00). On la décale de `D` minutes : vers l'avant si `D` est positif, vers l'arrière si `D` est négatif. Afficher l'heure qu'elle indique ensuite.

## Entrée
Une seule ligne contenant `H`, `M` et `D`, séparés par des espaces.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : l'heure (entre `0` et `23`) puis les minutes (entre `0` et `59`).

## Contraintes
- 0 ≤ H ≤ 23
- 0 ≤ M ≤ 59
- −10⁹ ≤ D ≤ 10⁹

## Indices
1. Convertir l'heure en un seul nombre : le nombre de minutes écoulées depuis 0 h 00. Une journée compte 24 × 60 = 1 440 minutes.
2. Après le décalage, il faut ramener le total entre 0 et 1 439 avec un reste. Attention, le total peut être négatif.
3. En Python, `x % 1440` est toujours entre 0 et 1 439, même si `x` est négatif. En C++, il faut écrire `((x % 1440) + 1440) % 1440`.

## Solution
On compte en minutes depuis 0 h 00 : `t = 60 × H + M + D`. Ajouter ou retirer des journées entières ne change pas l'heure affichée, donc l'heure finale correspond au reste de `t` par 1 440, pris entre 0 et 1 439. On affiche ensuite `t // 60` et `t % 60`.

Le piège est le signe du reste. En Python, `%` donne toujours un reste entre 0 et 1 439 quand on divise par 1 440. En C++, `%` a le signe du nombre divisé : `-60 % 1440` vaut `-60`, et le programme afficherait une heure négative. La correction `((t % 1440) + 1440) % 1440` ramène le reste entre 0 et 1 439. Il ne suffit pas d'ajouter 1 440 une seule fois à `t` : `D` peut valoir −10⁹, soit des centaines de milliers de journées.
