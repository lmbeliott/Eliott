---
id: reorganiser-les-chiffres-et-soustraire
title: Réorganiser les chiffres et soustraire
chapter: p2-synthese
order: 7
tags: [mathématiques, dictionnaires, fonctions]
samples: 2
---

## Énoncé
On travaille avec des nombres écrits avec exactement `D` chiffres, en ajoutant des zéros devant si besoin. Une **étape** transforme un nombre `x` ainsi : on range ses `D` chiffres dans l'ordre décroissant pour former le plus grand nombre possible, dans l'ordre croissant pour former le plus petit, et on soustrait le plus petit du plus grand.

Par exemple, avec `D = 4`, l'étape transforme `3524` en `5432 - 2345 = 3087`, puis `3087` en `8730 - 0378 = 8352`, puis `8352` en `8532 - 2358 = 6174`, et `6174` en `7641 - 1467 = 6174`.

En partant de `X` et en répétant l'étape, on finit forcément par retomber sur un nombre déjà obtenu. Afficher le nombre de valeurs différentes obtenues, `X` compris. Dans l'exemple, ce sont `3524`, `3087`, `8352` et `6174` : la réponse est 4.

## Entrée
Une seule ligne contenant `D` et `X`.

## Sortie
Un seul entier : le nombre de valeurs différentes de la suite.

## Contraintes
- 1 ≤ D ≤ 10
- 0 ≤ X < 10^D (en C++, utiliser des `long long`)

## Indices
1. Pour obtenir les `D` chiffres de `x`, zéros de tête compris, faire exactement `D` fois `x % 10` puis `x // 10`.
2. Inutile de trier : compter combien de fois apparaît chaque chiffre de 0 à 9 dans une liste de 10 compteurs. Le plus grand nombre s'obtient en écrivant les 9, puis les 8, …, puis les 0 ; le plus petit, dans l'ordre inverse.
3. Ranger les valeurs déjà obtenues dans un ensemble, et s'arrêter dès que la valeur courante y est déjà.

## Solution
On écrit une fonction `etape(x, d)`. Elle extrait les `d` chiffres de `x` avec `% 10` et `// 10`, exactement `d` fois : les zéros de tête apparaissent ainsi naturellement (avec `d = 4`, `378` donne les chiffres 8, 7, 3 et 0). Au lieu de trier les chiffres, elle les **compte** dans une liste `nb` de 10 cases. Le plus grand nombre se construit en parcourant les chiffres de 9 à 0 et en écrivant `nb[c]` fois chaque chiffre `c` (`grand = grand × 10 + c`) ; le plus petit, en parcourant de 0 à 9. Elle renvoie la différence, qui a encore au plus `d` chiffres.

La boucle principale garde un **ensemble** `vus` des valeurs déjà obtenues. Tant que `x` n'est pas dans `vus`, on l'ajoute et on applique l'étape. Quand `x` est déjà dans l'ensemble, la suite va désormais tourner en rond, et la taille de l'ensemble est la réponse.

Pourquoi la suite finit-elle par se répéter ? Toutes ses valeurs sont des nombres de `0` à `10^D - 1` : il n'y en a qu'un nombre fini. En pratique, la répétition arrive très vite : quelques dizaines d'étapes au plus pour les nombres de cette taille. Pour `D = 4`, on retombe toujours sur `6174` ou sur `0`, et pour `D = 3`, sur `495` ou `0`.

Le piège est d'oublier les zéros de tête : en lisant les chiffres avec `while x > 0`, le nombre `0378` n'aurait que trois chiffres, et l'étape suivante donnerait `873 - 378` au lieu de `8730 - 0378`.
