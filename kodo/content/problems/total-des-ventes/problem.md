---
id: total-des-ventes
title: Total des ventes
chapter: n1-boucles
order: 2
tags: [boucles]
samples: 2
---

## Énoncé
Un magasin note chaque soir le nombre d'articles vendus dans la journée.

Écris un programme qui lit le nombre de jours `N`, puis le nombre d'articles vendus chacun de ces jours, et affiche le nombre total d'articles vendus.

## Entrée
- La première ligne contient l'entier `N`, le nombre de jours.
- Chacune des `N` lignes suivantes contient un entier : le nombre d'articles vendus ce jour-là.

## Sortie
Un seul entier : le nombre total d'articles vendus pendant les `N` jours.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque jour, entre 0 et 1 000 articles sont vendus.

## Indices
1. Il faut une boucle qui fait `N` tours ; à chaque tour, elle lit une ligne.
2. Crée une variable `total` qui vaut `0` **avant** la boucle. À chaque tour, ajoute-lui le nombre que tu viens de lire.
3. Affiche `total` une seule fois, **après** la boucle.

## Solution
C'est le schéma de l'**accumulateur** : une variable `total` commence à `0` avant la boucle ; à chaque tour, on lit les ventes du jour et on les ajoute à `total` (`total = total + ventes`, ou `total += ventes`). Quand la boucle est terminée, `total` contient la somme de tous les jours, et on l'affiche.

Les pièges classiques :
- mettre `total = 0` **dans** la boucle : le total serait remis à zéro à chaque tour, et on afficherait seulement le dernier jour ;
- mettre l'affichage dans la boucle : on afficherait le total intermédiaire après chaque jour, au lieu d'un seul nombre ;
- oublier de lire `N` d'abord : la première ligne n'est pas un nombre de ventes, c'est le nombre de jours.
