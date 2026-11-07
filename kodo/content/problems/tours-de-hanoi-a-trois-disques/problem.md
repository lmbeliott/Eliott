---
id: tours-de-hanoi-a-trois-disques
title: Tours de Hanoï à trois disques
chapter: p1-affichage
order: 7
tags: [entrées-sorties, simulation]
samples: 1
no_input: true
---

## Énoncé
Trois piquets sont notés `A`, `B` et `C`. Sur le piquet `A` sont empilés trois disques de tailles différentes, le plus grand en bas et le plus petit en haut. Un **déplacement** consiste à prendre le disque du dessus d'un piquet et à le poser sur un autre piquet, à condition de ne jamais poser un disque sur un disque plus petit que lui.

Afficher une suite de déplacements qui amène les trois disques sur le piquet `C`, avec le moins de déplacements possible.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Un déplacement par ligne, dans l'ordre où on les effectue. Un déplacement s'écrit avec deux lettres séparées par une espace : le piquet de départ puis le piquet d'arrivée. Par exemple, `A B` signifie « prendre le disque du dessus du piquet `A` et le poser sur le piquet `B` ».

## Indices
1. Le grand disque doit à un moment passer de `A` à `C`. À cet instant, où doivent se trouver les deux autres disques ?
2. Il faut donc d'abord amener les deux petits disques sur `B`, en se servant de `C` comme piquet intermédiaire. Pour cela, le plus petit disque doit commencer par aller sur `C`.
3. Il faut 3 déplacements pour déplacer deux disques. Le total minimal est 3 + 1 + 3 = 7.

## Solution
Pour que le grand disque puisse passer de `A` à `C`, il doit être seul sur `A` et `C` doit être vide : les deux petits disques sont donc tous les deux sur `B`. Le plan se découpe en trois parties :

1. amener les deux petits disques de `A` vers `B` : `A C`, `A B`, `C B` (le plus petit fait un détour par `C`) ;
2. déplacer le grand disque : `A C` ;
3. amener les deux petits disques de `B` vers `C` : `B A`, `B C`, `A C` (cette fois, le détour se fait par `A`).

On obtient 7 déplacements, et on ne peut pas faire moins : déplacer deux disques demande au moins 3 déplacements, et il faut le faire avant et après le passage du grand disque. Pour vérifier la réponse, on simule les 7 déplacements sur papier en dessinant les trois piquets après chacun d'eux.

C'est un problème classique, les **tours de Hanoï**. Avec n disques, la même idée donne une solution en 2ⁿ − 1 déplacements ; on l'écrira avec un programme au chapitre sur la récursivité.
