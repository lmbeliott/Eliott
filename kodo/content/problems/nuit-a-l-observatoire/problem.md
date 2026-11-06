---
id: nuit-a-l-observatoire
title: Une nuit à l'observatoire
chapter: n1-affichage
order: 4
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Lina passe la nuit à l'observatoire de Valcorde pour photographier une comète. Elle commence son observation à `H` heures et `M` minutes, puis elle observe pendant `D` minutes sans s'arrêter. L'horloge de l'observatoire affiche les heures de `0` à `23` : après 23 h 59 vient 0 h 00.

Écris un programme qui affiche l'heure indiquée par l'horloge au moment où Lina termine son observation.

## Entrée
Une seule ligne contenant trois entiers `H`, `M` et `D` séparés par des espaces : l'heure et les minutes du début de l'observation, puis sa durée en minutes.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : les heures (entre `0` et `23`) puis les minutes (entre `0` et `59`) affichées par l'horloge à la fin de l'observation.

Écris les nombres normalement, sans zéro devant : pour 1 h 05, affiche `1 5`.

## Contraintes
- 0 ≤ H ≤ 23
- 0 ≤ M ≤ 59
- 0 ≤ D ≤ 1 000

## Indices
1. Les heures et les minutes ne se mélangent pas bien. Il est plus simple de tout compter en minutes : combien de minutes se sont écoulées depuis minuit quand Lina commence ?
2. Le début est à `H * 60 + M` minutes après minuit, et la fin à `D` minutes de plus. Pour revenir aux heures et aux minutes, utilise le quotient et le reste de la division par 60.
3. Si les heures dépassent 23, l'horloge est repartie de 0 après minuit : le reste de la division par 24 donne l'heure affichée.

## Solution
L'astuce est de tout convertir en minutes depuis minuit :
- le début est à `debut = H * 60 + M` ;
- la fin est à `fin = debut + D`.

On revient ensuite aux heures et aux minutes : les heures sont `fin // 60` et les minutes `fin % 60` (en C++, `fin / 60` et `fin % 60`). Si l'observation passe minuit, ce nombre d'heures vaut 24 ou plus ; l'horloge, elle, est repartie de zéro, donc on prend le reste de la division par 24.

Exemple : début à 23 h 10, soit 1 390 minutes ; durée 125 minutes ; fin à 1 515 minutes, soit 25 heures et 15 minutes. L'horloge affiche 25 % 24 = 1 heure, donc `1 15`.

Le piège classique : ajouter `D` aux minutes et s'arrêter là. 23 h 10 plus 125 minutes, ce n'est pas « 23 h 135 » ! Les minutes doivent rester entre 0 et 59, et c'est exactement ce que fait le passage par le total en minutes. Pas besoin de `if` : la division et le reste font tout le travail.
