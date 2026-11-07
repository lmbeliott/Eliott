---
id: plus-longue-serie-dans-un-intervalle
title: Plus longue série dans un intervalle
chapter: p1-booleens
order: 7
tags: [conditions, boucles]
samples: 3
---

## Énoncé
On relève la température pendant `N` jours. Un jour est **tempéré** si sa température est comprise entre `A` et `B` (bornes incluses). Afficher le plus grand nombre de jours tempérés consécutifs.

## Entrée
- La première ligne contient trois entiers `N`, `A` et `B`.
- La deuxième ligne contient `N` entiers séparés par des espaces : les températures, dans l'ordre.

## Sortie
Un seul entier : la longueur de la plus longue série de jours tempérés consécutifs, ou `0` s'il n'y a aucun jour tempéré.

## Contraintes
- 1 ≤ N ≤ 10 000
- −50 ≤ A ≤ B ≤ 50
- −50 ≤ chaque température ≤ 50

## Indices
1. On tient à jour la longueur de la série **en cours** : le nombre de jours tempérés consécutifs qui se terminent au jour qu'on vient de lire.
2. Un jour tempéré allonge la série en cours de 1. Un jour qui ne l'est pas la remet à 0.
3. La réponse est le maximum de toutes les valeurs prises par la série en cours.

## Solution
On garde deux variables, qui partent de 0 : `en_cours`, la longueur de la série qui se termine au jour actuel, et `record`, la plus grande longueur vue.

Pour chaque température `t` :
- si `A <= t and t <= B`, le jour est tempéré : `en_cours` augmente de 1, et si elle dépasse `record`, `record` prend sa valeur ;
- sinon, la série est interrompue : `en_cours` revient à 0.

Le piège est de ne mettre à jour le record qu'au moment où une série s'interrompt : une série qui dure jusqu'au dernier jour ne serait alors jamais prise en compte. Mettre à jour `record` à chaque jour tempéré évite ce problème.

Comme aucune valeur n'a besoin d'être traitée à part, en Python on peut parcourir directement les morceaux de la deuxième ligne.
