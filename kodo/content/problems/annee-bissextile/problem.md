---
id: annee-bissextile
title: Année bissextile
chapter: p1-conditions
order: 2
tags: [conditions]
samples: 3
---

## Énoncé
Une année est bissextile (elle a un 29 février) selon la règle suivante :
- une année divisible par 400 est bissextile ;
- sinon, une année divisible par 100 n'est pas bissextile ;
- sinon, une année divisible par 4 est bissextile ;
- toutes les autres années ne sont pas bissextiles.

Afficher `OUI` si l'année `A` est bissextile, `NON` sinon.

## Entrée
Une seule ligne contenant l'entier `A`.

## Sortie
`OUI` ou `NON`.

## Contraintes
- 1 ≤ A ≤ 100 000

## Indices
1. « `A` est divisible par 4 » s'écrit `A % 4 == 0`.
2. La règle est déjà écrite dans le bon ordre : chaque « sinon » correspond à un `elif` (ou `else if`).
3. Que se passe-t-il pour l'année 1900 si on teste d'abord la divisibilité par 4 ?

## Solution
On traduit la règle telle quelle, avec une chaîne `if` / `elif` / `elif` / `else` : divisible par 400 donne `OUI`, sinon divisible par 100 donne `NON`, sinon divisible par 4 donne `OUI`, sinon `NON`.

L'ordre est essentiel, car les cas se recouvrent : 1900 est divisible par 4, par 100, mais pas par 400. Comme seul le premier cas vrai est exécuté, il faut tester les règles les plus particulières (400, puis 100) avant la règle générale (4). Si on commence par la divisibilité par 4, 1900 est déclarée bissextile, ce qui est faux. De même, 2000 est bissextile : divisible par 400, elle est reconnue dès le premier test.
