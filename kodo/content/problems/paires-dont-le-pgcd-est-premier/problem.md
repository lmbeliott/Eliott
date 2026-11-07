---
id: paires-dont-le-pgcd-est-premier
title: Paires dont le PGCD est premier
chapter: n3-arithmetique
order: 6
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
On donne une liste de N entiers positifs A₁, A₂, …, A_N. Plusieurs nombres de la liste peuvent être égaux.

Écris un programme qui compte les paires de positions (i, j), avec i < j, telles que PGCD(Aᵢ, Aⱼ) est un nombre premier.

## Entrée
- La première ligne contient un entier N.
- La deuxième ligne contient N entiers A₁, A₂, …, A_N.

## Sortie
Un seul entier : le nombre de paires (i, j) avec i < j et PGCD(Aᵢ, Aⱼ) premier.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ Aᵢ ≤ 100 000

## Indices
1. Essayer toutes les paires coûte N × (N − 1) / 2 calculs de PGCD, soit 2 × 10⁸ pour N = 20 000 : trop lent. Raisonne plutôt sur les valeurs possibles du PGCD, qui sont au plus 100 000.
2. Pour un entier d, compte m(d), le nombre de valeurs de la liste qui sont multiples de d. Les m(d) × (m(d) − 1) / 2 paires formées de deux multiples de d sont exactement les paires dont le PGCD est un multiple de d.
3. Note E(d) le nombre de paires dont le PGCD vaut exactement d. Alors E(d) = m(d) × (m(d) − 1) / 2 − E(2d) − E(3d) − … : calcule les E(d) en partant du plus grand d, puis additionne E(p) pour les p premiers.

## Solution
**Raisonner sur le PGCD plutôt que sur les paires.** Soit V la plus grande valeur de la liste. Le PGCD d'une paire est un entier d entre 1 et V. Notons E(d) le nombre de paires dont le PGCD vaut **exactement** d : la réponse est la somme des E(p) pour p premier, et un crible d'Ératosthène jusqu'à V donne les nombres premiers.

**Compter les multiples.** Notons m(d) le nombre de positions i telles que Aᵢ est un multiple de d. Une paire a un PGCD multiple de d si et seulement si ses deux valeurs sont multiples de d : il y a donc m(d) × (m(d) − 1) / 2 telles paires. Pour obtenir m(d), on compte combien de fois apparaît chaque valeur, puis on additionne ces nombres pour d, 2d, 3d… jusqu'à V.

**Enlever les PGCD trop grands.** Parmi les paires de multiples de d, le PGCD vaut d, ou 2d, ou 3d… Donc E(d) = m(d) × (m(d) − 1) / 2 − E(2d) − E(3d) − … On calcule les E(d) pour d allant de V à 1 : quand on traite d, tous les E(kd) sont déjà connus.

Sur le premier exemple (4, 6, 8, 12, 7) : les multiples de 2 sont 4, 6, 8 et 12, ce qui donne 6 paires. Les multiples de 4 sont 4, 8 et 12 : 3 paires, et aucune n'a un PGCD multiple de 8 ou de 12 (ces nombres n'ont qu'un multiple dans la liste), donc E(4) = 3. Les multiples de 6 sont 6 et 12, donc E(6) = 1. Ainsi E(2) = 6 − E(4) − E(6) = 6 − 3 − 1 = 2 : ce sont les paires (4, 6) et (6, 8). Aucune paire n'a un PGCD égal à 3, 5 ou 7, et la réponse est 2.

**Complexité.** Pour chaque d, on parcourt les multiples de d jusqu'à V : V / 1 + V / 2 + … + V / V ≈ V × ln V opérations, soit environ 1,2 million pour V = 100 000, deux fois. Avec le crible et la lecture, c'est O(N + V log V).

**Pourquoi la solution naïve est trop lente.** Tester toutes les paires demande 2 × 10⁸ calculs de PGCD pour N = 20 000 : bien trop lent en Python, et limite même en C++.

**Pièges.**
- Additionner, pour chaque p premier, le nombre de paires de multiples de p ne marche pas : une paire de PGCD 4 serait comptée pour p = 2, et une paire de PGCD 6 deux fois (pour 2 et pour 3). Sur le premier exemple, on obtiendrait 7 au lieu de 2.
- Une paire de deux nombres égaux compte : PGCD(7, 7) = 7 est premier. Il faut compter les positions, pas les valeurs distinctes.
- 1 n'est pas premier : une paire de PGCD 1 ne compte pas.
- La réponse peut atteindre 2 × 10⁸ ; en C++, les produits m × (m − 1) se calculent en `long long`.
