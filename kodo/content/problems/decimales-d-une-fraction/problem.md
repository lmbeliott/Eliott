---
id: decimales-d-une-fraction
title: Décimales d'une fraction
chapter: p2-nombres
order: 7
tags: [arithmétique, mathématiques, boucles]
samples: 2
---

## Énoncé
Afficher la partie entière de `A / B`, puis les `K` premiers chiffres après la virgule de son écriture décimale. Les chiffres sont exacts : on ne les arrondit pas, on s'arrête simplement après le `K`-ième.

Par exemple, 22 / 7 = 3,142857142857… : avec `K = 5`, on affiche `3`, puis `14285`.

## Entrée
Une seule ligne contenant `A`, `B` et `K`, séparés par des espaces.

## Sortie
Deux lignes : la partie entière de `A / B`, puis les `K` chiffres après la virgule, collés les uns aux autres.

## Contraintes
- 0 ≤ A ≤ 10⁹
- 1 ≤ B ≤ 10⁹
- 1 ≤ K ≤ 10 000

## Indices
1. Un flottant ne donne qu'environ 16 chiffres significatifs, et ils ne sont même pas tous justes. Il faut calculer les chiffres un par un, comme dans une division posée.
2. Dans une division posée, on garde le **reste**. Pour obtenir le chiffre suivant, on multiplie le reste par 10, on divise par `B` : le quotient est le chiffre, et le nouveau reste sert pour le chiffre d'après.
3. Le reste est toujours plus petit que `B`, donc `10 × reste` reste plus petit que 10¹⁰ : en C++, il faut un `long long`.

## Solution
On reproduit la division posée de l'école. La partie entière est `A // B`, et le reste de départ est `r = A % B`. Ensuite, pour chacun des `K` chiffres :
- on « abaisse un zéro » : `r = 10 × r` ;
- le chiffre est `r // B`, qui est entre 0 et 9 puisque `r < 10 × B` ;
- le nouveau reste est `r % B`.

Pourquoi cela marche : si `r / B` est la partie après la virgule restant à écrire, avec `0 ≤ r < B`, alors `10 × r / B` décale la virgule d'un rang, sa partie entière est le chiffre suivant, et sa partie après la virgule vaut `(10 × r % B) / B`.

On affiche les chiffres sans espace (`print(c, end="")` en Python), puis un retour à la ligne final. Le programme fait `K` tours de boucle avec des entiers : il est exact et rapide. La solution flottante échoue dès le dix-septième chiffre environ, et parfois avant.
