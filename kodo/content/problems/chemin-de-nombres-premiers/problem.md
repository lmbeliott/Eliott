---
id: chemin-de-nombres-premiers
title: Chemin de nombres premiers
chapter: p4-graphes-implicites
order: 3
tags: [parcours-en-largeur, mathématiques, arithmétique]
samples: 2
---

## Énoncé
On part d'un nombre premier `A` et l'on veut atteindre le nombre premier `B`, qui a le même nombre de chiffres `D`. Une **étape** consiste à changer un seul chiffre du nombre courant. Après chaque étape, le nombre obtenu doit encore être un nombre premier à `D` chiffres (son premier chiffre n'est donc jamais `0`), et il ne doit pas faire partie d'une liste de nombres **interdits**.

Par exemple, avec `D = 2` et aucun interdit, on peut aller de `13` à `89` en 3 étapes : 13 → 19 → 79 → 89. Le minimum est de 2 étapes : 13 → 83 → 89.

Calculer le nombre minimal d'étapes pour aller de `A` à `B`, ou afficher `-1` si c'est impossible.

## Entrée
- La première ligne contient deux entiers `A` et `B`.
- La deuxième ligne contient un entier `K` : le nombre d'interdits.
- La troisième ligne contient `K` entiers : les nombres interdits (elle est vide si `K = 0`).

## Sortie
Un seul entier : le nombre minimal d'étapes, ou `-1`.

## Contraintes
- `A` et `B` sont des nombres premiers qui ont le même nombre `D` de chiffres, avec 1 ≤ D ≤ 5
- 0 ≤ K ≤ 1 000
- les interdits sont des nombres premiers à `D` chiffres, différents de `A` et de `B`

## Indices
1. Les états sont les nombres premiers à `D` chiffres, et deux états sont reliés s'ils diffèrent d'un seul chiffre. La réponse est une distance : parcours en largeur.
2. Un crible d'Ératosthène jusqu'à 100 000 dit en temps constant si un nombre est premier.
3. Pour énumérer les voisins de `x`, on remplace son chiffre de position `p` (de poids `10^p`) par chacun des autres chiffres : `x − c × 10^p + c' × 10^p`, où `c` est le chiffre actuel.

## Solution
On voit le problème comme un graphe **implicite** : un sommet est un nombre premier à `D` chiffres, et une arête relie deux nombres qui diffèrent d'un seul chiffre. La réponse est la distance de `A` à `B`, calculée par un parcours en largeur.

On précalcule les nombres premiers inférieurs à 100 000 avec le crible d'Ératosthène. Les voisins de `x` s'obtiennent sans passer par les chaînes de caractères : pour chaque position `p`, le chiffre actuel est `c = (x // 10^p) % 10`, et l'on essaie `y = x + (c' − c) × 10^p` pour chaque chiffre `c' ≠ c`, en excluant `c' = 0` sur la position de tête. On garde `y` s'il est premier, non interdit et pas encore visité. Les interdits sont simplement marqués comme déjà visités avant le parcours.

**Complexité.** Il y a au plus 8 363 nombres premiers à 5 chiffres, et chacun a au plus 5 × 9 = 45 candidats voisins : environ 400 000 tests, plus le crible.

**Remarque.** Sans interdit, on peut vérifier par ce même programme que tous les nombres premiers à au plus 5 chiffres sont reliés entre eux. C'est faux à 6 chiffres : aucun changement d'un seul chiffre de 294 001 ne donne un nombre premier.
