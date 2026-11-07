---
id: cavalier-sur-un-echiquier-troue
title: Cavalier sur un échiquier troué
chapter: p4-graphes-implicites
order: 2
tags: [grilles, parcours-en-largeur]
samples: 2
---

## Énoncé
Un plateau de `R` lignes et `C` colonnes contient des cases libres et des trous. Un cavalier, posé sur la case `S`, doit atteindre la case `T`. Comme aux échecs, il se déplace de deux cases dans une direction (horizontale ou verticale) puis d'une case dans la direction perpendiculaire : depuis une case, il a jusqu'à 8 destinations. Il saute par-dessus les cases intermédiaires, trous compris, mais ne peut jamais s'arrêter sur un trou ni sortir du plateau.

Calculer le nombre minimal de coups pour aller de `S` à `T`, ou afficher `-1` si c'est impossible.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un trou, `S` pour le départ et `T` pour l'arrivée.

Le plateau contient exactement un `S` et un `T`, sur des cases différentes.

## Sortie
Un seul entier : le nombre minimal de coups, ou `-1`.

## Contraintes
- 1 ≤ R, C ≤ 200
- 2 ≤ R × C

## Indices
1. Chaque case libre est un sommet ; chaque coup de cavalier possible est une arête. La réponse est une distance dans ce graphe.
2. Les 8 coups s'écrivent comme une liste de décalages `(dr, dc)` : `(±1, ±2)` et `(±2, ±1)`.
3. Comme sur un damier, un cavalier change de couleur de case à chaque coup : si la réponse existe, sa parité est connue d'avance, ce qui aide à vérifier ses résultats à la main.

## Solution
Le graphe a pour sommets les cases libres et pour arêtes les coups de cavalier. On ne le construit pas : depuis une case `(r, c)`, les 8 voisins sont `(r + dr, c + dc)` pour les 8 décalages `(±1, ±2)`, `(±2, ±1)`, à condition de rester sur le plateau et de ne pas tomber sur un trou.

Un parcours en largeur depuis `S`, avec un tableau de distances initialisé à `-1`, donne la distance de chaque case accessible ; la réponse est celle de `T`. D'après le cours, c'est bien le nombre minimal de coups.

**Complexité.** Chaque case entre au plus une fois dans la file et examine 8 voisins : O(R × C), soit 320 000 examens au plus.

**Remarque.** Le cavalier change de couleur de damier à chaque coup : si `S` et `T` sont de même couleur, la réponse est paire. Sur un plateau de 2 lignes, chaque coup déplace le cavalier d'exactement 2 colonnes, donc la parité de sa colonne ne change jamais ; sur un plateau 3 × 3, la case centrale est inaccessible. Ce sont de bons tests.
