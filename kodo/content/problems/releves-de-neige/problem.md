---
id: releves-de-neige
title: Les relevés de neige
chapter: n3-complexite
order: 1
tags: [sommes-préfixes]
samples: 2
time_limit_ms: 600
---

## Énoncé
À la station météo du col de Valcorde, Awa mesure chaque matin la neige fraîche tombée pendant la nuit : entre `0` et `9` centimètres. Pour gagner de la place, elle écrit ses N relevés à la suite, sans espace : le i-ème chiffre est la neige tombée pendant la nuit numéro i.

Les moniteurs de l'école de ski lui posent Q questions de la forme : « Combien de centimètres de neige sont tombés en tout de la nuit A à la nuit B, incluses ? »

Écris un programme qui répond à toutes leurs questions.

## Entrée
- La première ligne contient deux entiers N et Q.
- La deuxième ligne contient N chiffres collés : les relevés des nuits 1 à N, dans l'ordre.
- Chacune des Q lignes suivantes contient deux entiers A et B : une question.

## Sortie
Q lignes : pour chaque question, dans l'ordre de l'entrée, le nombre total de centimètres de neige tombés de la nuit A à la nuit B (incluses).

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A ≤ B ≤ N

## Indices
1. Additionner les relevés de A à B pour chaque question peut coûter jusqu'à N × Q = 500 millions d'additions : beaucoup trop. Il faut faire le gros du travail une seule fois, avant de lire les questions.
2. Construis un tableau `cumul` où `cumul[i]` est la neige tombée pendant les i premières nuits, avec `cumul[0] = 0`.
3. La neige tombée de la nuit A à la nuit B, c'est celle des B premières nuits moins celle des A − 1 premières : `cumul[B] - cumul[A - 1]`.

## Solution
**L'idée : les sommes préfixes.** On calcule une seule fois `cumul[i]`, le total des i premières nuits : `cumul[0] = 0` et `cumul[i] = cumul[i − 1] + (relevé de la nuit i)`. Ensuite, chaque question se règle avec une seule soustraction : le total des nuits A à B vaut `cumul[B] − cumul[A − 1]`.

Sur l'exemple `3015002`, on obtient `cumul = 0 3 3 4 9 9 9 11`. Pour la question « nuits 2 à 4 », on calcule `cumul[4] − cumul[1] = 9 − 3 = 6`.

**Complexité.** O(N) pour construire `cumul`, puis O(1) par question : O(N + Q) en tout, environ 100 000 opérations.

**Pourquoi la solution naïve est trop lente.** Refaire l'addition pour chaque question coûte jusqu'à N opérations par question, donc N × Q = 5 × 10⁸ opérations dans le pire cas : plusieurs dizaines de secondes en Python. Même `sum(releves[a-1:b])` doit recopier et parcourir des centaines de millions de cases.

**Pièges.**
- Les nuits sont numérotées à partir de 1. Grâce à la case `cumul[0] = 0`, la formule `cumul[B] − cumul[A − 1]` marche aussi quand A = 1, sans cas particulier.
- Les relevés sont des caractères : il faut convertir chaque chiffre en nombre (`int(c)` en Python, `c - '0'` en C++).
- Avec des milliers de lignes, lis toute l'entrée d'un coup avec `sys.stdin` plutôt qu'avec `input()`.
