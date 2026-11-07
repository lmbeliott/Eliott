---
id: rangee-et-place
title: Rangée et place
chapter: n1-affichage
order: 5
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Dans une salle, chaque rangée contient `M` places. Les personnes entrent une par une et s'assoient dans l'ordre d'arrivée : d'abord toute la première rangée, de la place 1 à la place `M`, puis toute la deuxième rangée, et ainsi de suite. Les rangées et les places sont numérotées à partir de 1.

Écris un programme qui affiche le numéro de la rangée et le numéro de la place de la `K`-ième personne entrée.

## Entrée
Une seule ligne contenant deux entiers `M` et `K` séparés par une espace : le nombre de places par rangée, puis le numéro d'arrivée de la personne.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : le numéro de la rangée, puis le numéro de la place.

## Contraintes
- 1 ≤ M ≤ 1 000
- 1 ≤ K ≤ 1 000 000

## Indices
1. Fais un essai à la main avec `M = 10` : les personnes 1 à 10 sont dans la rangée 1, les personnes 11 à 20 dans la rangée 2. Où est la personne 20 ? Et la personne 21 ?
2. Calculer `K // M` ne suffit pas : avec `M = 10`, les personnes 10 et 11 donnent toutes les deux `1`, alors qu'elles ne sont pas dans la même rangée. Le souci vient des numéros qui commencent à 1.
3. Compte plutôt à partir de 0 : la personne `K` est la personne numéro `K - 1` si l'on commence à 0. Avec cette numérotation, le quotient et le reste de la division par `M` donnent directement la rangée et la place, elles aussi comptées à partir de 0. Il ne reste plus qu'à ajouter 1.

## Solution
Les numéros qui commencent à 1 compliquent les calculs. L'astuce est de tout compter à partir de 0 :
- la `K`-ième personne a le numéro `K - 1` ;
- avec des rangées de `M` places, la personne numéro `K - 1` est dans la rangée numéro `(K - 1) // M`, à la place numéro `(K - 1) % M`, toutes les deux comptées à partir de 0 ;
- on ajoute 1 à chacune pour revenir à une numérotation qui commence à 1.

Exemple : `M = 10` et `K = 20`. On calcule `19 // 10 = 1` et `19 % 10 = 9`, donc la rangée 2 et la place 10. C'est bien la dernière place de la deuxième rangée.

Le piège classique : calculer directement `K // M` et `K % M`. Pour `K = 20`, on obtiendrait la rangée 2 et la place 0, qui n'existe pas ! Le décalage de 1 règle tous les cas d'un coup, sans aucun `if`.
