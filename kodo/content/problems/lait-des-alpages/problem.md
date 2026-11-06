---
id: lait-des-alpages
title: Le lait des alpages
chapter: n1-boucles
order: 2
tags: [boucles]
samples: 2
---

## Énoncé
Tout l'été, les vaches de Valcorde paissent sur les alpages. Chaque soir, Malik, le berger, descend le lait à la fromagerie et note dans son carnet combien de litres il a apportés. À la fin de la saison, il veut connaître le nombre total de litres livrés.

Écris un programme qui lit le nombre de jours `N`, puis la quantité de lait livrée chacun de ces jours, et affiche la quantité totale.

## Entrée
- La première ligne contient l'entier `N`, le nombre de jours.
- Chacune des `N` lignes suivantes contient un entier : le nombre de litres livrés ce jour-là.

## Sortie
Un seul entier : le nombre total de litres livrés pendant les `N` jours.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque jour, entre 0 et 1 000 litres sont livrés.

## Indices
1. Il faut une boucle qui fait `N` tours ; à chaque tour, elle lit une ligne.
2. Crée une variable `total` qui vaut `0` **avant** la boucle. À chaque tour, ajoute-lui le nombre que tu viens de lire.
3. Affiche `total` une seule fois, **après** la boucle.

## Solution
C'est le schéma de l'**accumulateur** : une variable `total` commence à `0` avant la boucle ; à chaque tour, on lit la quantité du jour et on l'ajoute à `total` (`total = total + litres`, ou `total += litres`). Quand la boucle est terminée, `total` contient la somme de tous les jours, et on l'affiche.

Les pièges classiques :
- mettre `total = 0` **dans** la boucle : le total serait remis à zéro à chaque tour, et on afficherait seulement le dernier jour ;
- mettre l'affichage dans la boucle : on afficherait le total intermédiaire après chaque jour, au lieu d'un seul nombre ;
- oublier de lire `N` d'abord : la première ligne n'est pas une quantité de lait, c'est le nombre de jours.
