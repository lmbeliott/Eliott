---
id: rectangle-de-somme-maximale
title: Rectangle de somme maximale
chapter: p3-tableaux-avances
order: 8
synthesis: true
tags: [grilles, listes, fonctions]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des entiers, positifs ou négatifs. Trouver un rectangle de cases (au moins une case), formé de lignes consécutives et de colonnes consécutives, dont la somme des valeurs est la plus grande possible. Afficher cette somme.

## Entrée
- La première ligne contient `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` entiers.

## Sortie
La plus grande somme d'un rectangle.

## Contraintes
- 1 ≤ R ≤ 25
- 1 ≤ C ≤ 1 000
- Les valeurs sont comprises entre −99 et 99.

## Indices
1. Avec une seule ligne, c'est le problème de la meilleure portion du cours, qui se résout en un passage.
2. Fixons la première ligne `haut` et la dernière ligne `bas` du rectangle. Si l'on remplace chaque colonne par la somme de ses cases entre `haut` et `bas`, que devient le problème ?
3. Quand `bas` augmente de 1, chaque somme de colonne augmente de la valeur de la nouvelle ligne : pas besoin de tout recalculer.

## Solution
Un rectangle est déterminé par sa première ligne `haut`, sa dernière ligne `bas`, sa première colonne `g` et sa dernière colonne `d`. Fixons `haut` et `bas`, et notons `col[j]` la somme des cases de la colonne `j` entre les lignes `haut` et `bas`. La somme du rectangle vaut alors `col[g] + col[g + 1] + … + col[d]` : c'est la somme d'une portion du tableau `col`. Le meilleur rectangle de lignes `haut` à `bas` s'obtient donc avec l'algorithme de la portion de plus grande somme du cours, placé dans une fonction et appliqué à `col` : un seul passage sur `C` cases.

On essaie toutes les paires `haut ≤ bas` : pour chaque `haut`, on part de `col` rempli de zéros, puis on fait descendre `bas` de `haut` à `R − 1`, en ajoutant à chaque fois la ligne `bas` à `col`. Ce tableau est ainsi toujours égal aux sommes des colonnes entre `haut` et `bas`, sans jamais tout recalculer. Comme tout rectangle a une première et une dernière ligne, il est examiné pour sa paire `(haut, bas)`, et le plus grand des résultats est la réponse.

**Coût.** Il y a `R × (R + 1) / 2` paires de lignes, soit 325 pour `R = 25`, et chacune demande deux passages sur les `C` colonnes : environ 650 000 étapes. Essayer tous les rectangles et additionner leurs cases demanderait des milliards d'opérations. Le meilleur rectangle peut être négatif (toutes les cases négatives) : comme dans le cours, on initialise le maximum avec une vraie case, pas avec 0. On place la petite dimension, `R ≤ 25`, dans la boucle double : fixer plutôt deux colonnes et parcourir les lignes ferait `C × (C + 1) / 2 × R` étapes, plus de 12 millions, vingt fois plus.
