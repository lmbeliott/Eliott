---
id: echanger-des-jetons
title: Échanger des jetons
chapter: p3-recursivite
order: 7
tags: [récursivité, mathématiques, dictionnaires]
samples: 2
---

## Énoncé
Un jeton porte un entier positif ou nul, sa **valeur**. Un jeton de valeur n peut être échangé contre trois jetons, de valeurs ⌊n/2⌋, ⌊n/3⌋ et ⌊n/5⌋ (divisions entières). Chaque jeton obtenu peut à son tour être échangé, ou gardé. Par exemple, un jeton de valeur 100 s'échange contre 50, 33 et 20, soit 103 en tout ; en échangeant ensuite le jeton 50 contre 25, 16 et 10, on monte à 104.

Pour Q jetons de départ, trouver la plus grande valeur totale qu'on peut obtenir.

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient la valeur N d'un jeton de départ.

## Sortie
Q lignes : pour chaque jeton, la plus grande valeur totale qu'on peut obtenir.

## Contraintes
- 1 ≤ Q ≤ 50
- 0 ≤ N ≤ 10¹⁸

## Indices
1. Notons `v(n)` la meilleure valeur à partir d'un jeton n. On garde le jeton, ou on l'échange et on traite au mieux chacun des trois nouveaux jetons : `v(n) = max(n, v(⌊n/2⌋) + v(⌊n/3⌋) + v(⌊n/5⌋))`.
2. Programmée telle quelle, cette fonction recalcule sans cesse les mêmes valeurs : `v(⌊n/6⌋)` est demandé par `v(⌊n/2⌋)` et par `v(⌊n/3⌋)`, et ainsi de suite. Le nombre d'appels explose.
3. Ranger dans un dictionnaire chaque valeur déjà calculée (mémoïsation). Très peu d'entiers différents sont réellement atteints.

## Solution
La meilleure valeur obtenue à partir d'un jeton n vérifie `v(0) = 0` et `v(n) = max(n, v(⌊n/2⌋) + v(⌊n/3⌋) + v(⌊n/5⌋))`. En effet, soit on garde le jeton, soit on l'échange ; dans ce cas, les trois nouveaux jetons évoluent indépendamment, et le mieux est de tirer le meilleur de chacun.

**Pourquoi la version directe est trop lente.** Sans mémoire, le nombre d'appels A(n) vérifie A(n) = 1 + A(⌊n/2⌋) + A(⌊n/3⌋) + A(⌊n/5⌋). Comme 1/2 + 1/3 + 1/5 > 1, il croît plus vite que n lui-même : environ 10¹⁹ appels pour N = 10¹⁸ (et déjà 4 millions pour N = 10⁶).

**Mémoïsation.** Avant de calculer `v(n)`, on regarde si la valeur est dans un dictionnaire ; sinon, on la calcule et on l'y range. Chaque valeur n'est alors calculée qu'une fois. Or les entiers atteints sont tous de la forme ⌊N / (2^a 3^b 5^c)⌋, car ⌊⌊x/p⌋/q⌋ = ⌊x/(pq)⌋. Avec a ≤ 59, b ≤ 37 et c ≤ 25, et seulement les triplets pour lesquels 2^a 3^b 5^c ≤ N, cela fait environ 7 000 valeurs différentes pour N = 10¹⁸. Le dictionnaire est partagé entre les questions.

La profondeur des appels ne dépasse pas 61, car la valeur est au moins divisée par 2 à chaque niveau. En C++, on utilise une `map<long long, long long>` ; les résultats restent inférieurs à 4 × 10¹⁸ et tiennent dans un `long long`.
