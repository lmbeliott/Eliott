---
id: plus-grand-rectangle-vide
title: Plus grand rectangle vide
chapter: p3-synthese
order: 9
tags: [grilles, listes]
samples: 2
---

## Énoncé
Un terrain est découpé en une grille de L lignes et C colonnes. Chaque case est libre (`.`) ou occupée (`#`). On veut y construire un bâtiment rectangulaire, aux côtés parallèles aux bords de la grille, qui ne recouvre que des cases libres.

Trouver la plus grande aire possible, en nombre de cases.

## Entrée
La première ligne contient L et C. Les L lignes suivantes contiennent chacune C caractères `.` ou `#`.

## Sortie
La plus grande aire d'un rectangle formé uniquement de cases libres, ou `0` si toutes les cases sont occupées.

## Contraintes
- 1 ≤ L, C ≤ 300

## Indices
1. Il y a environ L² C² / 4 rectangles, soit 2 × 10⁹ pour L = C = 300 : impossible de tous les essayer. Fixer d'abord la ligne du bas du rectangle.
2. Pour une ligne du bas fixée, noter h[c] le nombre de cases libres consécutives dans la colonne c en remontant à partir de cette ligne. Le problème devient : dans un histogramme de hauteurs h[0], …, h[C − 1], trouver le plus grand rectangle. Et h se met à jour en O(C) d'une ligne à la suivante.
3. Le meilleur rectangle de l'histogramme a la hauteur d'une de ses colonnes, la plus basse. Pour chaque colonne c, il s'étend de part et d'autre jusqu'à la première colonne strictement plus basse. Une pile permet de trouver ces colonnes pour toutes les c en O(C).

## Solution
**Fixer la ligne du bas.** Tout rectangle libre a une ligne du bas. Pour une ligne du bas l, on calcule h[c] : le nombre de cases libres consécutives qui finissent en (l, c) dans la colonne c. On a h[c] = 0 si la case (l, c) est occupée, et h[c] = (ancien h[c]) + 1 sinon. Un rectangle libre de ligne du bas l, couvrant les colonnes g à d, a une hauteur au plus min(h[g], …, h[d]), et cette hauteur est atteinte. Il reste donc à trouver, pour chaque ligne, le plus grand rectangle sous l'histogramme h.

**Plus grand rectangle d'un histogramme.** Dans un rectangle optimal, la hauteur est celle de sa colonne la plus basse, disons c, et le rectangle s'étend aussi loin que possible : à gauche jusqu'à la première colonne g < c plus basse que h[c] (exclue), et à droite jusqu'à la première colonne d > c plus basse que h[c] (exclue). Son aire est h[c] × (d − g − 1). On calcule ces bornes pour toutes les colonnes avec une **pile** de colonnes de hauteurs croissantes. On parcourt c de 0 à C, avec une colonne fictive de hauteur 0 en C. Tant que le sommet t de la pile a une hauteur ≥ h[c], on le dépile : c est la première colonne à sa droite qui est au moins aussi basse, et la nouvelle colonne au sommet de la pile est la dernière à sa gauche strictement plus basse ; on calcule l'aire h[t] × (c − sommet − 1) (avec sommet = −1 si la pile est vide). Puis on empile c.

**Correction.** Pour une colonne t, la borne de droite utilisée est la première colonne à sa droite de hauteur ≤ h[t], et non strictement plus basse. Mais si plusieurs colonnes d'un rectangle optimal ont la même hauteur minimale, c'est la plus à droite d'entre elles qui donne le rectangle complet : l'aire maximale est bien obtenue.

**Coût.** Chaque colonne est empilée et dépilée une fois par ligne : O(C) par ligne, O(L × C) en tout, soit environ 90 000 cases à traiter quelques fois. Essayer toutes les paires de colonnes pour chaque ligne du bas, en tenant à jour le minimum des hauteurs, coûterait O(L × C²) ≈ 2,7 × 10⁷ : trop pour Python.
