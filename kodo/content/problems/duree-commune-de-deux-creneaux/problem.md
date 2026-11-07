---
id: duree-commune-de-deux-creneaux
title: Durée commune de deux créneaux
chapter: n1-conditions
order: 7
tags: [conditions]
samples: 3
---

## Énoncé
Les heures d'une journée sont comptées en minutes depuis minuit. Un premier créneau commence à la minute `A` et se termine à la minute `B` : il dure `B - A` minutes. Un second créneau commence à la minute `C` et se termine à la minute `D`.

Écris un programme qui affiche le nombre de minutes pendant lesquelles les deux créneaux ont lieu en même temps.

Si un créneau se termine exactement quand l'autre commence, ils n'ont aucune minute en commun.

## Entrée
- La première ligne contient deux entiers `A` et `B` : le début et la fin du premier créneau.
- La deuxième ligne contient deux entiers `C` et `D` : le début et la fin du second créneau.

## Sortie
Un seul entier : le nombre de minutes communes aux deux créneaux.

## Contraintes
- 0 ≤ A < B ≤ 1 440
- 0 ≤ C < D ≤ 1 440

## Indices
1. Dessine les deux créneaux sur une ligne de temps. Quand les deux ont lieu en même temps, la partie commune est elle aussi un créneau : quand commence-t-elle ? Quand se termine-t-elle ?
2. La partie commune commence au plus tard des deux débuts, et se termine au plus tôt des deux fins. Calcule ces deux nombres avec des `if`.
3. Si la partie commune se termine avant de commencer, ou au moment où elle commence, les créneaux n'ont rien en commun : la réponse est 0.

## Solution
Pendant la partie commune, les deux créneaux ont déjà commencé : elle commence donc au plus tard des deux débuts, `debut = max(A, C)`. Et aucun des deux n'est encore terminé : elle se termine au plus tôt des deux fins, `fin = min(B, D)`.

Si `fin > debut`, la partie commune dure `fin - debut` minutes. Sinon, un créneau se termine avant que l'autre commence (ou juste au moment où il commence), et la réponse est 0.

Pour calculer le plus grand de deux nombres, un `if` suffit : `debut` vaut `A`, et si `C > A`, il vaut `C`. De même pour la fin.

Exemple : `A = 60`, `B = 180`, `C = 120`, `D = 300`. La partie commune va de la minute 120 à la minute 180 : 60 minutes.

Les pièges :
- calculer `B - C` sans réfléchir : si le second créneau est entièrement à l'intérieur du premier (`100 500` et `200 250`), la bonne réponse est 50, la durée du second, et pas 300 ;
- oublier le cas où les créneaux sont séparés : `fin - debut` est alors négatif, et il faut afficher 0 ;
- oublier que les créneaux peuvent être donnés dans n'importe quel ordre : le second peut commencer avant le premier.
