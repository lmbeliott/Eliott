---
id: regions-d-une-image
title: Régions d'une image
chapter: p4-graphes-implicites
order: 1
tags: [grilles, parcours-en-largeur]
samples: 2
---

## Énoncé
Une image de `R` lignes et `C` colonnes est formée de pixels ; chaque pixel a une couleur, notée par une lettre minuscule. Deux pixels sont **voisins** s'ils se touchent par un côté (haut, bas, gauche ou droite). Une **région** est un ensemble maximal de pixels de même couleur dans lequel on peut aller de n'importe quel pixel à n'importe quel autre en passant de voisin en voisin, sans quitter la couleur.

Compter les régions de l'image et donner le nombre de pixels de la plus grande.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` lettres minuscules : l'image, ligne par ligne.

## Sortie
Deux entiers sur une ligne : le nombre de régions, puis le nombre de pixels de la plus grande région.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. L'image est un graphe : les sommets sont les pixels, et deux pixels voisins de même couleur sont reliés par une arête. Les régions sont ses composantes connexes.
2. Inutile de construire le graphe : les voisins d'un pixel `(r, c)` se calculent à la volée, en vérifiant qu'ils sont dans l'image et de la même couleur.
3. Une région peut contenir 90 000 pixels, en forme de serpent : un remplissage récursif dépasse la profondeur autorisée. Utiliser une file ou une pile.

## Solution
On parcourt les pixels ligne par ligne. Chaque pixel pas encore visité ouvre une nouvelle région : un parcours en largeur depuis ce pixel visite tous les pixels de même couleur qu'on peut atteindre de voisin en voisin, et compte combien il en visite. C'est la recherche des composantes connexes du cours, dans un graphe **implicite** dont les voisins se calculent au lieu d'être stockés.

Chaque pixel entre une fois dans la file et examine ses 4 voisins : O(R × C).

**Piège.** Un remplissage récursif (« je colorie ce pixel puis je m'appelle sur ses 4 voisins ») est correct, mais sa profondeur peut atteindre le nombre de pixels de la région : `RecursionError` en Python, débordement de pile en C++ sur une région en spirale.
