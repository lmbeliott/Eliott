---
id: plus-longue-montee
title: Plus longue montée
chapter: n1-boucles
order: 7
tags: [boucles, conditions]
samples: 2
---

## Énoncé
On a relevé `N` mesures, l'une après l'autre. Une **montée** est un groupe de mesures qui se suivent, dans lequel chaque mesure est strictement plus grande que la précédente. Une mesure seule forme une montée de longueur 1.

Écris un programme qui affiche la longueur de la plus longue montée, c'est-à-dire son nombre de mesures.

Par exemple, dans `3 1 4 5 9 2 6`, la plus longue montée est `1 4 5 9` : sa longueur est 4.

## Entrée
- La première ligne contient l'entier `N`, le nombre de mesures.
- Chacune des `N` lignes suivantes contient un entier : une mesure, dans l'ordre des relevés.

## Sortie
Un seul entier : la longueur de la plus longue montée.

## Contraintes
- 1 ≤ N ≤ 10 000
- Chaque mesure est comprise entre 0 et 1 000 000.

## Indices
1. Lis les mesures une par une, et garde en mémoire la mesure précédente. Pour chaque nouvelle mesure, une seule question compte : est-elle strictement plus grande que la précédente ?
2. Garde aussi la longueur de la montée en cours, celle qui se termine sur la mesure qu'on vient de lire. Si la nouvelle mesure est plus grande que la précédente, la montée continue : sa longueur augmente de 1. Sinon, une nouvelle montée commence, de longueur 1.
3. Après chaque mesure, compare la longueur de la montée en cours avec la meilleure longueur vue jusqu'ici. Ne le fais pas seulement quand une montée s'arrête : la plus longue peut aller jusqu'à la dernière mesure.

## Solution
On lit la première mesure à part : elle forme une montée de longueur 1, qui est aussi la meilleure pour l'instant. Puis, pour chacune des `N - 1` mesures suivantes :
- si elle est strictement plus grande que la précédente, la montée en cours continue : `en_cours = en_cours + 1` ;
- sinon, une nouvelle montée commence avec cette mesure : `en_cours = 1` ;
- si `en_cours` dépasse `meilleure`, on met `meilleure` à jour ;
- enfin, la mesure lue devient la « précédente » pour le tour suivant.

Exemple avec `3 1 4 5 9 2 6` : la longueur en cours vaut successivement 1, 1, 2, 3, 4, 1, 2. La plus grande est 4.

Les pièges :
- deux mesures égales arrêtent la montée : il faut « strictement plus grande », donc `>` et pas `>=` ;
- mettre `meilleure` à jour seulement quand une montée s'arrête : si la plus longue montée finit sur la dernière mesure, on l'oublie. Mettre à jour après chaque mesure évite ce souci ;
- commencer `meilleure` à 0 : avec une seule mesure, la réponse est 1.
