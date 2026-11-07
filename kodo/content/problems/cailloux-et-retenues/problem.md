---
id: cailloux-et-retenues
title: Cailloux et retenues
chapter: p3-correction
order: 5
tags: [simulation, mathématiques]
samples: 2
---

## Énoncé
`N` boîtes sont alignées, numérotées de 1 à `N`, et la boîte `i` contient `Cᵢ` cailloux. Une **opération** consiste à choisir une boîte `i < N` qui contient au moins 2 cailloux, à en retirer 2, et à ajouter 1 caillou dans la boîte `i + 1`. On fait des opérations, dans n'importe quel ordre, jusqu'à ce qu'aucune ne soit possible.

On peut montrer que le processus s'arrête toujours, et que le nombre d'opérations et l'état final ne dépendent pas de l'ordre choisi. Afficher ce nombre d'opérations et le contenu final des boîtes.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` entiers `C₁, …, Cₙ`.

## Sortie
- Sur la première ligne, le nombre d'opérations.
- Sur la deuxième ligne, les `N` nombres de cailloux à la fin, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 15 000
- 0 ≤ Cᵢ ≤ 10⁹

## Indices
1. Le nombre total de cailloux diminue de 1 à chaque opération : c'est pourquoi le processus s'arrête. Mais simuler les opérations une par une peut en demander des milliers de milliards.
2. Une opération dans la boîte `i` ne touche pas les boîtes de gauche. On peut donc vider « au maximum » la boîte 1 d'un coup, puis la boîte 2, et ainsi de suite.
3. Pour justifier que l'ordre ne compte pas, chercher une quantité qui ne change pas : donner à chaque caillou de la boîte `i` la valeur `2^(i − 1)`.

## Solution
**Une méthode rapide.** Les opérations faites dans la boîte `i` ne modifient que les boîtes `i` et `i + 1`. On traite donc les boîtes de gauche à droite : dans la boîte `i` (pour `i < N`), qui contient alors `c` cailloux, on fait d'un coup les `q = c // 2` opérations possibles. Il reste `c % 2` caillou, et la boîte `i + 1` en reçoit `q`. Aucune opération ultérieure ne touche plus la boîte `i`. À la fin, chaque boîte sauf la dernière contient 0 ou 1 caillou : plus aucune opération n'est possible. Le nombre d'opérations est la somme des `q`.

**Pourquoi l'ordre ne compte pas.** Donnons à chaque caillou de la boîte `i` la valeur `2^(i − 1)`, et notons `S` la valeur totale. Une opération retire deux cailloux de valeur `2^(i − 1)` et ajoute un caillou de valeur `2^i` : `S` ne change pas, c'est un **invariant**. À la fin, les boîtes 1 à `N − 1` contiennent 0 ou 1 caillou, et la boîte `N` en contient `m`. Alors `S = b₁ + 2 b₂ + … + 2^(N−2) b_(N−1) + 2^(N−1) m`, avec chaque `bᵢ` égal à 0 ou 1 : c'est l'écriture de `S` en base 2 pour les `N − 1` derniers chiffres, et `m` est le quotient de `S` par `2^(N−1)`. Cet état final est donc entièrement déterminé par `S`, quel que soit l'ordre des opérations.

**Terminaison.** Le nombre total de cailloux est un entier positif ou nul qui diminue de 1 à chaque opération : c'est un **variant**, et le processus s'arrête. Mieux : le nombre d'opérations est exactement le nombre de cailloux au départ moins le nombre à la fin, qui est fixé. Il ne dépend donc pas non plus de l'ordre.

**Coût.** Un passage sur les boîtes : de l'ordre de `N` opérations, au lieu d'une par caillou retiré, jusqu'à 1,5 × 10¹³. Les nombres de cailloux reçus peuvent dépasser 2³¹ : en C++, il faut des `long long`.
