---
id: elimination-en-cercle
title: Élimination en cercle
chapter: p2-tableaux
order: 8
synthesis: true
tags: [listes, simulation, arithmétique]
samples: 2
---

## Énoncé
`N` personnes, numérotées de 1 à `N`, sont placées en cercle dans l'ordre : après la personne `N` vient la personne 1. On compte les personnes à partir de la personne 1, et la `K`-ième personne comptée sort du cercle. On recommence alors à compter à partir de la personne suivante, parmi celles qui restent, et ainsi de suite jusqu'à ce que tout le monde soit sorti. Afficher les numéros des personnes dans l'ordre de leur sortie.

Par exemple, avec `N = 5` et `K = 2`, les personnes sortent dans l'ordre `2 4 1 5 3`.

## Entrée
Une seule ligne contenant `N` et `K`, séparés par une espace.

## Sortie
Une seule ligne avec les `N` numéros, dans l'ordre de sortie, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 2 000
- 1 ≤ K ≤ 10⁹

## Indices
1. Un tableau `present` de `N` cases indique qui est encore dans le cercle. Pour avancer d'une personne, on passe à l'indice suivant, en revenant à 0 après `N − 1` : `(i + 1) % N`. Les personnes sorties sont sautées.
2. `K` peut valoir un milliard : compter une personne à la fois serait bien trop long. Quand il reste `R` personnes, faire un tour complet du cercle ramène au même endroit.
3. Avec `R` personnes restantes, compter `K` personnes revient à compter `(K − 1) % R + 1` personnes. On avance donc de `(K − 1) % R` personnes présentes à partir de la personne courante, qui compte pour 1.

## Solution
On simule la sortie des `N` personnes, une à la fois. Le tableau `present` indique qui est encore dans le cercle, et `pos` est l'indice de la personne à partir de laquelle on compte (elle est comptée « 1 »).

Pour chaque sortie, avec `R` personnes restantes :
- on calcule `s = (K − 1) % R`. En effet, après `R` personnes comptées, on revient à la personne de départ : seuls les tours incomplets comptent ;
- on avance `pos` de `s` personnes **présentes** : on passe à `(pos + 1) % N` et on ne décompte que si cette personne est encore là ;
- la personne `pos` sort : on note son numéro `pos + 1` et on met `present[pos]` à faux ;
- s'il reste quelqu'un, on avance `pos` jusqu'à la prochaine personne présente, qui sera comptée « 1 » au tour suivant.

Grâce au reste, chaque sortie demande au plus un tour du cercle, soit `N` cases examinées : au total, au plus `N × N` = 4 millions d'étapes. Sans le reste, avec `K = 10⁹`, chaque sortie demanderait un milliard d'étapes. Le piège principal est le décalage d'un : la personne de départ compte déjà pour 1, il faut donc avancer de `K − 1` personnes, et non de `K`.
