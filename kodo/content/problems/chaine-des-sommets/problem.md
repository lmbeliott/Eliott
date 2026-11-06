---
id: chaine-des-sommets
title: La chaîne des sommets
chapter: n4-dynamique
order: 4
tags: [programmation-dynamique, tri, dichotomie]
samples: 2
---

## Énoncé
Chloé prépare l'ascension du Grand Pic de Valcorde. Le carnet du club alpin décrit `N` sommets de la vallée par leur altitude et leur cotation de difficulté. Pour s'entraîner progressivement, Chloé veut un **programme** : une suite de sommets différents, choisis dans le carnet dans l'ordre qu'elle veut, où chaque sommet est à la fois **strictement plus haut** et **strictement plus difficile** que le précédent.

Écris un programme qui calcule le nombre maximal de sommets d'un tel programme.

## Entrée
- La première ligne contient un entier `N`.
- Chacune des `N` lignes suivantes contient deux entiers `A` et `D` : l'altitude et la difficulté d'un sommet.

Plusieurs sommets peuvent avoir la même altitude, la même difficulté, ou les deux.

## Sortie
Un seul entier : le nombre maximal de sommets d'un programme.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ A, D ≤ 10 000

## Indices
1. Si les sommets sont triés par altitude croissante, un programme est une sous-suite de la liste triée. Que doit-il se passer pour les difficultés le long de cette sous-suite ?
2. Il reste à trouver la plus longue sous-suite strictement croissante des difficultés. La version en O(N²) est trop lente : garde, pour chaque longueur `k`, la plus petite difficulté possible du dernier sommet d'une sous-suite de longueur `k`. Ce tableau est trié, et tu peux le mettre à jour par dichotomie.
3. Attention aux sommets de même altitude : ils ne peuvent pas se suivre dans un programme. Trie-les par difficulté **décroissante** à altitude égale : ainsi, deux d'entre eux ne peuvent jamais former une sous-suite strictement croissante.

## Solution
**Réduction à une dimension.** On trie les sommets par altitude croissante. Un programme, lu dans l'ordre, a des altitudes strictement croissantes : c'est donc une sous-suite de la liste triée, dont les difficultés sont strictement croissantes. Le problème devient celui de la **plus longue sous-suite strictement croissante** (LIS) des difficultés.

**L'astuce des égalités.** Deux sommets de même altitude ne peuvent pas se suivre. Si on les trie par difficulté **décroissante** à altitude égale, leurs difficultés ne forment jamais une suite croissante, donc la LIS ne peut pas en prendre deux. Avec un tri croissant à altitude égale, la LIS pourrait enchaîner `(1500, 2)` puis `(1500, 5)`, ce qui est interdit.

**La LIS en O(N log N).** La programmation dynamique directe (« `lis[i]` = plus long programme finissant par le sommet `i`, calculé à partir de tous les `j < i` ») coûte O(N²), soit environ 10⁸ comparaisons pour `N = 15 000` : trop lent. On maintient plutôt un tableau `fin`, où `fin[k]` est la plus petite difficulté possible pour le dernier sommet d'une sous-suite strictement croissante de longueur `k + 1`. Ce tableau est strictement croissant. Pour chaque difficulté `d`, dans l'ordre :
- on cherche par dichotomie la première position `k` telle que `fin[k] ≥ d` ;
- si elle n'existe pas, `d` prolonge la plus longue sous-suite : on l'ajoute à la fin ;
- sinon, on remplace `fin[k]` par `d` : on obtient une sous-suite de longueur `k + 1` qui finit plus bas.

La réponse est la longueur finale de `fin`. Complexité : **O(N log N)** pour le tri et les `N` dichotomies.

Pièges :
- Pour une suite **strictement** croissante, on cherche le premier élément `≥ d` (`bisect_left` en Python, `lower_bound` en C++). Avec `> d` (`bisect_right`, `upper_bound`), on autoriserait deux difficultés égales.
- Le tableau `fin` n'est pas un programme valide en lui-même : seule sa longueur a un sens.
