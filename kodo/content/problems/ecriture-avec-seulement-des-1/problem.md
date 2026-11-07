---
id: ecriture-avec-seulement-des-1
title: Écriture avec seulement des 1
chapter: p4-dichotomie
order: 7
tags: [dichotomie, mathématiques]
samples: 1
---

## Énoncé
En base 2, l'entier 31 s'écrit `11111`, et en base 5, il s'écrit `111`, car 31 = 1 + 5 + 25. Pour tout entier N ≥ 3, il existe au moins une base b ≥ 2 dans laquelle N ne s'écrit qu'avec des chiffres 1 : par exemple la base N − 1, où N s'écrit `11`.

Répondre à T questions : pour N donné, afficher la **plus petite** base b ≥ 2 dans laquelle N ne s'écrit qu'avec des chiffres 1.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient un entier N.

## Sortie
T lignes : pour chaque question, la plus petite base qui convient.

## Contraintes
- 1 ≤ T ≤ 100
- 3 ≤ N ≤ 10¹⁸

## Indices
1. N s'écrit avec m chiffres 1 en base b si et seulement si N = 1 + b + b² + … + b^(m−1). Combien de chiffres au plus ? Comme b ≥ 2, on a N ≥ 2^(m−1).
2. Pour un nombre de chiffres m fixé, la somme 1 + b + … + b^(m−1) augmente avec b : on peut chercher b par dichotomie.
3. Plus il y a de chiffres, plus la base est petite. On essaie donc m de 60 à 2, et on s'arrête à la première longueur pour laquelle une base existe.

## Solution
**Mettre en équation.** N s'écrit `11…1` (m chiffres) en base b si et seulement si N = S_m(b) = 1 + b + b² + … + b^(m−1). Comme b ≥ 2, S_m(b) ≥ 2^(m−1), donc m − 1 ≤ log₂(10¹⁸) < 60 : il y a au plus 60 chiffres. Et m = 2 marche toujours, avec b = N − 1.

**Plus de chiffres, base plus petite.** Si N = S_m(b) = S_m'(c) avec m' > m, alors c < b : sinon S_m'(c) ≥ S_m'(b) > S_m(b), puisqu'on ajoute des termes positifs. On essaie donc les longueurs de m = 60 à m = 2, et la première qui admet une base donne la réponse.

**Dichotomie sur la base.** Pour m fixé, S_m est strictement croissante en b, donc il existe au plus une base b telle que S_m(b) = N, et on la cherche par dichotomie : on cherche le plus petit b tel que S_m(b) ≥ N, puis on vérifie l'égalité. Comme b^(m−1) ≤ N < 2⁶⁰, la base est inférieure à 2^(⌊60 / (m − 1)⌋ + 1) : c'est la borne haute de la dichotomie. Pour calculer S_m(b) sans débordement, on ajoute les puissances une par une et on s'arrête dès que la somme dépasse N, en testant avant chaque multiplication que la puissance suivante ne dépasse pas N.

**Coût.** Pour chaque m, environ 60 / (m − 1) étapes de dichotomie, chacune avec au plus m multiplications : quelques milliers d'opérations par question. Essayer toutes les bases b = 2, 3, … demanderait jusqu'à 10¹⁸ essais quand la réponse est N − 1.
