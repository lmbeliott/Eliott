---
id: sommes-sur-des-intervalles
title: Sommes sur des intervalles
chapter: n3-complexite
order: 1
tags: [sommes-préfixes]
samples: 2
time_limit_ms: 600
---

## Énoncé
Un capteur enregistre chaque jour une valeur entière entre `0` et `9`. Ses N valeurs sont écrites à la suite, sans espace : le i-ème chiffre est la valeur du jour i.

Écris un programme qui répond à Q questions de la forme : « Quelle est la somme des valeurs du jour A au jour B, inclus ? »

## Entrée
- La première ligne contient deux entiers N et Q.
- La deuxième ligne contient N chiffres collés : les valeurs des jours 1 à N, dans l'ordre.
- Chacune des Q lignes suivantes contient deux entiers A et B : une question.

## Sortie
Q lignes : pour chaque question, dans l'ordre de l'entrée, la somme des valeurs du jour A au jour B (inclus).

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A ≤ B ≤ N

## Indices
1. Additionner les valeurs de A à B pour chaque question peut coûter jusqu'à N × Q = 500 millions d'additions : beaucoup trop. Il faut faire le gros du travail une seule fois, avant de lire les questions.
2. Construis un tableau `cumul` où `cumul[i]` est la somme des i premières valeurs, avec `cumul[0] = 0`.
3. La somme du jour A au jour B, c'est celle des B premiers jours moins celle des A − 1 premiers : `cumul[B] - cumul[A - 1]`.

## Solution
**L'idée : les sommes préfixes.** On calcule une seule fois `cumul[i]`, le total des i premiers jours : `cumul[0] = 0` et `cumul[i] = cumul[i − 1] + (valeur du jour i)`. Ensuite, chaque question se règle avec une seule soustraction : le total des jours A à B vaut `cumul[B] − cumul[A − 1]`.

Sur l'exemple `3015002`, on obtient `cumul = 0 3 3 4 9 9 9 11`. Pour la question « jours 2 à 4 », on calcule `cumul[4] − cumul[1] = 9 − 3 = 6`.

**Complexité.** O(N) pour construire `cumul`, puis O(1) par question : O(N + Q) en tout, environ 100 000 opérations.

**Pourquoi la solution naïve est trop lente.** Refaire l'addition pour chaque question coûte jusqu'à N opérations par question, donc N × Q = 5 × 10⁸ opérations dans le pire cas : plusieurs dizaines de secondes en Python. Même `sum(int(c) for c in chiffres[a-1:b])` doit recopier et parcourir des centaines de millions de cases.

**Pièges.**
- Les jours sont numérotés à partir de 1. Grâce à la case `cumul[0] = 0`, la formule `cumul[B] − cumul[A − 1]` marche aussi quand A = 1, sans cas particulier.
- Les valeurs sont des caractères : il faut convertir chaque chiffre en nombre (`int(c)` en Python, `c - '0'` en C++).
- Avec des milliers de lignes, lis toute l'entrée d'un coup avec `sys.stdin` plutôt qu'avec `input()`.
