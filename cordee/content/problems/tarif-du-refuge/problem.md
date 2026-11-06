---
id: tarif-du-refuge
title: Le tarif du refuge
chapter: n1-conditions
order: 3
tags: [conditions]
samples: 2
---

## Énoncé
Le refuge des Aiguilles accueille les randonneurs pour la nuit. Sur la porte, Awa, la gardienne, a affiché le prix d'une nuit, qui dépend de l'âge :

| Âge | Prix de la nuit |
| --- | --- |
| moins de 4 ans | gratuit (0 euro) |
| de 4 à 11 ans | 12 euros |
| de 12 à 17 ans | 18 euros |
| de 18 à 64 ans | 25 euros |
| 65 ans et plus | 20 euros |

Sur cette affiche, « de 4 à 11 ans » veut dire : 4 ans, 11 ans, et tous les âges entre les deux.

Écris un programme qui lit l'âge d'un randonneur et affiche le prix de sa nuit au refuge.

## Entrée
Une seule ligne contenant un entier `A` : l'âge du randonneur, en années.

## Sortie
Un seul entier : le prix de la nuit, en euros (sans écrire « euros »).

## Contraintes
- 0 ≤ A ≤ 110

## Indices
1. Il y a cinq tranches d'âge. Teste-les dans l'ordre, de la plus jeune à la plus âgée, avec `if`, puis plusieurs `elif` (`else if` en C++), puis `else`.
2. Les tests s'enchaînent : quand le programme arrive au deuxième test, il sait déjà que le premier était faux. Si le premier test est `a < 4`, le deuxième peut donc simplement être `a <= 11` : pas besoin de vérifier à nouveau que `a >= 4`.
3. Essaie ton programme sur les âges aux frontières : 3, 4, 11, 12, 17, 18, 64 et 65.

## Solution
On enchaîne les tests, de la tranche la plus jeune à la plus âgée :
- si `A < 4`, le prix est 0 ;
- sinon, si `A <= 11`, le prix est 12 ;
- sinon, si `A <= 17`, le prix est 18 ;
- sinon, si `A <= 64`, le prix est 25 ;
- sinon, le prix est 20.

Grâce à `elif` (ou `else if`), un seul cas est choisi : le premier dont la condition est vraie. C'est pour cela que l'ordre des tests compte. Si on testait `A <= 64` en premier, un enfant de 10 ans paierait 25 euros !

Le piège classique est de se tromper aux frontières : à 11 ans, on paie encore 12 euros, et c'est à 12 ans qu'on passe à 18 euros. Écrire `A < 11` au lieu de `A <= 11` (ou `A < 12`) ferait payer 18 euros à un enfant de 11 ans.
