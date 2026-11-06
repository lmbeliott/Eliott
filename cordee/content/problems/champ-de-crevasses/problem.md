---
id: champ-de-crevasses
title: Le champ de crevasses
chapter: n2-grilles
order: 2
tags: [grilles, boucles]
samples: 2
---

## Énoncé
Sur le glacier de Valcorde, les guides ont repéré toutes les crevasses. Leur carte est un quadrillage où une crevasse est notée `*` et une case de glace sûre est notée `.`.

Pour aider les randonneurs, Awa veut fabriquer une nouvelle carte : chaque case sûre y est remplacée par le nombre de crevasses parmi ses **huit** cases voisines (en haut, en bas, à gauche, à droite et dans les quatre diagonales). Les crevasses restent notées `*`.

Écris un programme qui affiche la carte d'Awa.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et de colonnes.
- Les `H` lignes suivantes contiennent chacune `W` caractères, `*` ou `.` : la carte des guides.

## Sortie
`H` lignes de `W` caractères : la carte d'Awa. Chaque `*` reste un `*`, chaque `.` est remplacé par un chiffre entre `0` et `8`.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50

## Indices
1. Traite les cases une par une. Pour une case sûre `(i, j)`, ses huit voisines sont les cases `(i + di, j + dj)` avec `di` et `dj` valant chacun `-1`, `0` ou `1`, sauf `di = dj = 0` (c'est la case elle-même).
2. Une case au bord de la carte a moins de huit voisines. Avant de lire `carte[i + di][j + dj]`, vérifie que la ligne est entre `0` et `H - 1` et que la colonne est entre `0` et `W - 1`.
3. Construis chaque ligne de la nouvelle carte dans une chaîne, en ajoutant soit `*`, soit le nombre de crevasses converti en texte (`str(nb)` en Python, `(char)('0' + nb)` en C++), puis affiche-la.

## Solution
Pour chaque case `(i, j)` :
- si c'est une crevasse, on écrit `*` ;
- sinon, on compte les crevasses voisines avec deux petites boucles sur `di` et `dj` allant de `-1` à `1`. On saute le cas `di = dj = 0`, puis on vérifie que la voisine `(i + di, j + dj)` est bien dans la carte avant de regarder si c'est un `*`.

On construit ainsi chaque ligne de la nouvelle carte et on l'affiche.

Les pièges :
- **les bords** : en Python, `carte[-1]` ne provoque pas d'erreur mais désigne la dernière ligne ! Le programme se tromperait sans rien dire. En C++, lire en dehors du tableau peut donner n'importe quoi. Le test des bornes est indispensable ;
- ne pas compter la case elle-même : c'est inutile ici (elle est sûre), mais c'est une bonne habitude ;
- ne pas modifier la carte des guides pendant qu'on la parcourt : un chiffre écrit trop tôt serait relu comme une case. On écrit le résultat dans une nouvelle carte (ou on l'affiche directement).
