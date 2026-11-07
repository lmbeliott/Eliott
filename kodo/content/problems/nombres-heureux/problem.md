---
id: nombres-heureux
title: Nombres heureux
chapter: p2-fonctions
order: 6
tags: [fonctions, listes, mathématiques]
samples: 2
---

## Énoncé
À partir d'un entier `N ≥ 1`, on calcule la somme des carrés de ses chiffres, puis on recommence avec le résultat, et ainsi de suite. Par exemple, 19 → 1 + 81 = 82 → 64 + 4 = 68 → 36 + 64 = 100 → 1. Le nombre 19 atteint 1 en 4 étapes : on dit qu'il est **heureux**.

D'autres nombres n'atteignent jamais 1 et tournent en rond : 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → …

Pour chaque nombre donné, afficher le nombre d'étapes nécessaires pour atteindre 1, ou `-1` s'il n'atteint jamais 1.

## Entrée
- La première ligne contient l'entier `Q`.
- Chacune des `Q` lignes suivantes contient un entier `N`.

## Sortie
`Q` lignes : pour chaque `N`, dans l'ordre, le nombre d'étapes pour atteindre 1 (`0` si `N = 1`), ou `-1`.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ N ≤ 10¹⁸

## Indices
1. Écrire une fonction `suivant(n)` qui renvoie la somme des carrés des chiffres de `n`.
2. Un nombre de 18 chiffres au plus donne, après une étape, une valeur au plus 18 × 81 = 1 458. Ensuite, toutes les valeurs restent inférieures à 1 500.
3. Si une valeur apparaît une seconde fois, la suite répète la même boucle pour toujours et n'atteindra jamais 1. Une liste de 1 500 booléens, créée dans la fonction, permet de retenir les valeurs déjà vues.

## Solution
La fonction `suivant(n)` additionne les carrés des chiffres de `n`. Une fonction `etapes(n)` simule la suite : tant que `n ≠ 1`, elle remplace `n` par `suivant(n)` et compte les étapes.

Pour savoir quand s'arrêter si `n` n'est pas heureux, on remarque que chaque valeur ne dépend que de la précédente : si une valeur revient, tout ce qui suit se répète, et 1 ne sera jamais atteint. Or, après la première étape, les valeurs sont toutes inférieures à 1 500 (au plus 9² × 18 = 1 458, puis encore moins). La fonction crée donc une liste locale `vu` de 1 500 booléens à `False`. Avant chaque étape, si `n < 1500`, elle regarde `vu[n]` : s'il vaut `True`, elle renvoie `-1` ; sinon, elle le met à `True`. Comme il n'y a que 1 500 valeurs possibles, la boucle s'arrête après au plus quelques centaines d'étapes.

La liste `vu` doit être recréée à chaque appel : c'est une variable locale de `etapes`. Une liste globale partagée par tous les appels donnerait des réponses fausses, car les valeurs vues pour un nombre précédent ne disent rien sur le nombre suivant.

En C++, `N` peut atteindre 10¹⁸ : il faut un `long long`.

Pour aller plus loin : on peut démontrer que tout nombre non heureux finit dans la boucle de 4 citée dans l'énoncé.
