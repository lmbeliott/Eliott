---
id: jours-de-gel
title: Les matins de gel
chapter: n1-boucles
order: 3
tags: [boucles, conditions]
samples: 2
---

## Énoncé
À l'observatoire de Valcorde, Sofia relève la température tous les matins à 7 heures. Quand le thermomètre descend sous zéro, l'eau de la fontaine du village gèle et les enfants viennent glisser dessus. Sofia veut savoir combien de matins il a gelé ce mois-ci.

Écris un programme qui lit le nombre de matins `N`, puis les `N` températures relevées par Sofia, et affiche le nombre de matins où la température était **strictement** négative, c'est-à-dire plus petite que 0.

## Entrée
- La première ligne contient l'entier `N`, le nombre de matins.
- Chacune des `N` lignes suivantes contient un entier : la température relevée ce matin-là, en degrés.

## Sortie
Un seul entier : le nombre de matins où la température était strictement négative.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque température est comprise entre −30 et 30.

## Indices
1. C'est comme une somme, sauf qu'au lieu d'ajouter la température, on ajoute 1 à un compteur… mais seulement les matins où il gèle.
2. Dans la boucle, après avoir lu la température `t`, utilise un `if` : si `t < 0`, augmente le compteur de 1.
3. Un matin à 0 degré ne compte pas : 0 n'est pas strictement négatif.

## Solution
On utilise un **compteur** : une variable qui vaut `0` avant la boucle. À chaque tour, on lit une température ; si elle est strictement négative (`t < 0`), on ajoute 1 au compteur. Après la boucle, on affiche le compteur.

C'est le même schéma que pour une somme, avec un `if` dans la boucle. Attention à l'indentation : le `if` est dans la boucle, et l'ajout de 1 est dans le `if`.

Le piège classique : écrire `t <= 0`. Les matins à exactement 0 degré seraient alors comptés, alors que l'énoncé demande des températures strictement négatives.
