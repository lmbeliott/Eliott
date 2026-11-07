---
id: approcher-une-cible-avec-quatre-operations
title: Approcher une cible avec les quatre opérations
chapter: p4-exploration
order: 4
tags: [backtracking, mathématiques]
samples: 2
---

## Énoncé
On dispose de `N` nombres entiers positifs et d'un nombre cible `T`. Une **étape** consiste à choisir deux des nombres disponibles, à les retirer, et à les remplacer par leur somme, leur différence, leur produit ou leur quotient, avec deux règles : une différence doit être strictement positive, et un quotient n'est permis que si la division tombe juste. On peut faire autant d'étapes qu'on veut (y compris aucune), et s'arrêter à tout moment.

Un nombre est **atteignable** s'il fait partie des nombres disponibles à un moment ou à un autre. Par exemple, avec `1 3 4 6`, les étapes 3 + 1 = 4, puis 4 × 4 = 16, puis 16 × 6 = 96 montrent que 96 est atteignable ; 24 l'est aussi, en une seule étape : 6 × 4.

Calculer le plus petit écart `|v − T|` entre un nombre atteignable `v` et la cible.

## Entrée
- La première ligne contient deux entiers `N` et `T`.
- La deuxième ligne contient les `N` nombres.

## Sortie
Un seul entier : le plus petit écart entre un nombre atteignable et `T`.

## Contraintes
- 1 ≤ N ≤ 6
- 1 ≤ T ≤ 1 000 000
- chaque nombre est entre 1 et 100

## Indices
1. Une fonction récursive reçoit la liste des nombres disponibles ; pour chaque paire et chaque opération permise, elle s'appelle sur la liste obtenue, qui a un nombre de moins.
2. Avec 6 nombres, l'arbre des appels a plusieurs millions de nœuds, car la même liste est obtenue par beaucoup de chemins différents (faire `a + b` puis `c × d`, ou `c × d` puis `a + b`).
3. Mémoriser dans un ensemble les listes déjà explorées, triées pour que l'ordre ne compte pas, et ne pas les explorer une deuxième fois.

## Solution
**Retour sur trace.** La fonction `explorer(liste)` essaie toutes les paires `(a, b)` de la liste, avec `a ≥ b`, et toutes les opérations permises : `a + b`, `a × b`, `a − b` si `a > b`, `a ÷ b` si `b` divise `a`. Chaque résultat `v` met à jour le meilleur écart, puis on appelle `explorer` sur la liste où `a` et `b` sont remplacés par `v`. Les nombres de départ sont pris en compte avant le premier appel. Tout nombre atteignable apparaît ainsi dans une des listes parcourues, puisque la fonction essaie toutes les étapes possibles depuis chaque liste.

**Taille de l'arbre.** Une liste de `k` nombres a `k(k − 1)/2` paires et au plus 4 résultats par paire. Pour `N = 6`, cela donne jusqu'à 60 × 40 × 24 × 12 × 4 ≈ 2,8 millions de feuilles : trop pour Python. Mais beaucoup de nœuds représentent la même situation : une liste de nombres ne dépend pas de l'ordre dans lequel les étapes ont été faites. On range donc chaque liste, triée et convertie en tuple, dans un ensemble `deja_vus`, et l'on n'explore jamais deux fois la même. Le nombre de listes différentes rencontrées n'est que de quelques dizaines de milliers.

On s'arrête aussi dès que l'écart vaut 0 : on ne peut pas faire mieux.

**Pourquoi c'est juste.** Ce qui reste à explorer depuis une liste ne dépend que de son contenu, pas du chemin qui y a mené : ignorer une liste déjà explorée ne fait perdre aucun nombre atteignable.

Les nombres peuvent devenir grands (jusqu'à 100⁶ = 10¹² environ) : en C++, on utilise des `long long`.
