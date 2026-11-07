---
id: solde-final-d-un-compte
title: Solde final d'un compte
chapter: p1-lecture
order: 4
tags: [entrées-sorties, boucles]
samples: 2
---

## Énoncé
Un compte contient `S` euros. On effectue ensuite `N` opérations : un nombre positif est un dépôt, un nombre négatif est un retrait. Afficher le solde du compte après toutes les opérations.

## Entrée
- La première ligne contient deux entiers `S` et `N` séparés par une espace.
- Les `N` lignes suivantes contiennent chacune un entier : le montant d'une opération.

## Sortie
Un seul entier : le solde final (il peut être négatif).

## Contraintes
- 0 ≤ S ≤ 1 000 000
- 1 ≤ N ≤ 1 000
- −10 000 ≤ chaque opération ≤ 10 000

## Indices
1. La première ligne contient deux nombres : on la découpe avec `split()`.
2. Une boucle de `N` tours lit une opération par tour, avec un `input()` par ligne.
3. Le solde part de `S`, et chaque opération s'y ajoute, qu'elle soit positive ou négative.

## Solution
Le solde est une variable qui part de `S`. À chaque tour de boucle, on lit une opération et on l'ajoute au solde : ajouter un nombre négatif revient à retirer de l'argent, donc il n'y a pas de cas à distinguer. Après la boucle, on affiche le solde.

Le piège est le format de l'entrée : la première ligne contient deux valeurs, les suivantes une seule. En Python, on écrit `s, n = map(int, input().split())`, puis `int(input())` dans la boucle.
