---
id: classement-des-votes
title: Classement des votes
chapter: n2-trier-compter
order: 3
tags: [dictionnaires, tri]
samples: 2
---

## Énoncé
Des personnes votent pour leur couleur préférée : chaque vote donne entre 1 et 5 points à une couleur. Une même couleur peut recevoir plusieurs votes, et son score est la somme de tous les points qu'elle a reçus.

Écris un programme qui affiche le classement des couleurs : du plus grand score au plus petit. Quand deux couleurs ont le même score, celle dont le nom vient en premier dans l'ordre alphabétique est classée devant.

## Entrée
- La première ligne contient un entier `N` : le nombre de votes.
- Les `N` lignes suivantes contiennent chacune un vote : le nom d'une couleur (en lettres minuscules sans accents), puis un entier, le nombre de points, séparés par une espace.

## Sortie
Une ligne par couleur ayant reçu au moins un vote, dans l'ordre du classement : son nom, une espace, puis son score.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque nom contient entre 1 et 15 lettres.
- Chaque vote donne entre 1 et 5 points.

## Indices
1. Il faut d'abord calculer le score de chaque couleur. Un dictionnaire dont les clés sont les noms et les valeurs les scores est parfait pour ça.
2. Pour classer, fabrique une liste de couples et trie-la. Quel couple choisir pour que le tri range les scores du plus grand au plus petit, et les égalités par ordre alphabétique ?
3. Astuce : trie des couples `(-score, nom)`. Le plus grand score a le plus petit `-score`, donc il passe en premier ; et à score égal, le tri compare les noms, dans l'ordre alphabétique. N'oublie pas de réafficher le score sans le signe moins.

## Solution
Le problème se fait en deux étapes.

**Compter.** On parcourt les votes et on additionne les points de chaque couleur dans un dictionnaire `total`. En Python, il faut créer la clé à `0` la première fois qu'on rencontre un nom. En C++, avec une `map<string, int>`, `total[nom] += points` suffit : une clé absente est créée automatiquement avec la valeur `0`.

**Trier.** On veut un ordre sur deux critères : le score décroissant, puis le nom croissant. On construit la liste des couples `(-score, nom)` et on la trie normalement, dans l'ordre croissant. Comme on compare d'abord `-score`, le plus grand score arrive en tête ; et quand les scores sont égaux, les noms départagent dans l'ordre alphabétique. On affiche ensuite chaque nom avec son score, en remettant le score dans le bon sens.

Les pièges :
- trier les couples `(score, nom)` avec `reverse=True` (ou les trier puis inverser la liste) : les égalités seraient alors aussi dans l'ordre alphabétique **inverse**, ce qui est faux ;
- oublier qu'une couleur peut recevoir plusieurs votes : il faut additionner, pas remplacer ;
- l'ordre alphabétique des mots qui commencent pareil : `or` passe avant `orange`. Les comparaisons de chaînes de Python et de C++ le font toutes seules.
