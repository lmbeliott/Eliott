---
id: k-ieme-deplacement-des-tours-de-hanoi
title: K-ième déplacement des tours de Hanoï
chapter: p3-recursivite
order: 6
tags: [récursivité, mathématiques]
samples: 2
---

## Énoncé
Trois piquets sont numérotés 1, 2 et 3. Sur le piquet 1 sont empilés N disques de tailles 1 (le plus petit, en haut) à N (le plus grand, en bas). On les déplace tous vers le piquet 3, un disque à la fois, sans jamais poser un disque sur un plus petit, avec la méthode récursive classique. Pour déplacer une tour de n disques du piquet a vers le piquet b, en se servant du piquet c :

1. si n = 0, il n'y a rien à faire ;
2. sinon, on déplace la tour des n − 1 plus petits disques de a vers c (en se servant de b) ;
3. on déplace le disque n de a vers b ;
4. on déplace la tour des n − 1 plus petits disques de c vers b (en se servant de a).

Le déplacement complet, de 1 vers 3 en se servant de 2, compte 2^N − 1 étapes. Répondre à Q questions : quel est le K-ième déplacement ?

## Entrée
La première ligne contient N et Q. Chacune des Q lignes suivantes contient un entier K.

## Sortie
Pour chaque question, une ligne avec trois entiers : le numéro du disque déplacé, le piquet de départ et le piquet d'arrivée.

## Contraintes
- 1 ≤ N ≤ 60
- 1 ≤ Q ≤ 1 000
- 1 ≤ K ≤ 2^N − 1

## Indices
1. Avec N = 60, il y a plus de 10¹⁸ déplacements : impossible de les simuler. Il faut descendre directement vers le bon déplacement.
2. Déplacer une tour de n disques prend exactement 2^n − 1 étapes (par récurrence). Les 2^(n−1) − 1 premières étapes déplacent la petite tour, l'étape suivante déplace le disque n, les autres déplacent à nouveau la petite tour.
3. Une fonction `trouver(n, a, b, c, k)` compare `k` à `2^(n−1)` et ne fait qu'un seul appel récursif, avec les bons piquets.

## Solution
Notons T(n) le nombre d'étapes pour déplacer une tour de n disques. T(0) = 0 et T(n) = 2 T(n − 1) + 1, donc T(n) = 2^n − 1 : par récurrence, 2 × (2^(n−1) − 1) + 1 = 2^n − 1.

Dans le déplacement d'une tour de n disques de a vers b, posons `m = 2^(n−1)`. Les étapes 1 à m − 1 forment le déplacement de la petite tour de a vers c, l'étape m déplace le disque n de a vers b, et les étapes m + 1 à 2^n − 1 forment le déplacement de la petite tour de c vers b. D'où la fonction récursive `trouver(n, a, b, c, k)` :

- si `k = m`, la réponse est le disque n, de a vers b ;
- si `k < m`, c'est la k-ième étape de la petite tour : `trouver(n − 1, a, c, b, k)` ;
- si `k > m`, c'est l'étape `k − m` du second déplacement : `trouver(n − 1, c, b, a, k − m)`.

**Correction.** Par récurrence sur n : le découpage ci-dessus recopie les étapes 2 à 4 de la méthode, et `k` reste toujours entre 1 et 2^n − 1, donc l'appel atteint le cas `k = m` au plus tard quand n = 1.

**Coût.** Chaque appel fait un seul appel récursif, avec n diminué de 1 : au plus 60 appels par question, au lieu de 2^60 étapes simulées. En C++, K et `m` se calculent en `long long`, avec `1LL << (n − 1)` : l'écriture `1 << (n − 1)` déborde dès que n dépasse 32.
