---
id: plus-longue-periode-occupee
title: Plus longue période occupée
chapter: n2-trier-compter
order: 6
tags: [tri]
samples: 2
---

## Énoncé
Une salle a été réservée sur `N` créneaux. Chaque créneau va de la minute `D` à la minute `F` : la salle est occupée pendant tout ce temps. Les créneaux sont donnés dans le désordre, et ils peuvent se chevaucher.

Une **période d'occupation** est un intervalle de temps le plus long possible pendant lequel la salle est occupée sans interruption. Si un créneau se termine à la minute 30 et qu'un autre commence à la minute 30, il n'y a pas d'interruption : ils font partie de la même période.

Écris un programme qui affiche le nombre de périodes d'occupation, et la durée de la plus longue.

## Entrée
- La première ligne contient l'entier `N`, le nombre de créneaux.
- Les `N` lignes suivantes contiennent chacune deux entiers `D` et `F` : le début et la fin d'un créneau, en minutes.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le nombre de périodes d'occupation, puis la durée, en minutes, de la plus longue.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ D < F ≤ 1 000 000

## Indices
1. Trie les créneaux par heure de début. Ensuite, parcours-les dans cet ordre en gardant le début et la fin de la période en cours.
2. Quand le créneau suivant commence au plus tard à la fin de la période en cours, il en fait partie : la période se prolonge peut-être. Sinon, il y a un trou : la période en cours est terminée, et une nouvelle commence avec ce créneau.
3. Attention aux créneaux entièrement compris dans la période en cours : avec `(5, 100)` puis `(20, 30)`, la période va toujours jusqu'à 100, pas jusqu'à 30. La nouvelle fin est la plus grande des deux fins. Et n'oublie pas de compter la dernière période après la boucle.

## Solution
Une fois les créneaux triés par heure de début, chaque période d'occupation correspond à un groupe de créneaux **consécutifs** dans la liste triée. On les parcourt donc dans l'ordre en gardant `debut` et `fin`, les bornes de la période en cours, initialisées avec le premier créneau. Pour chaque créneau suivant `(d, f)` :
- si `d ≤ fin`, le créneau commence avant la fin de la période, ou pile à la fin : il en fait partie, et la période va maintenant jusqu'à `max(fin, f)` ;
- sinon, il y a un trou entre `fin` et `d` : on compte la période en cours, on compare sa durée `fin - debut` à la plus longue vue jusqu'ici, puis une nouvelle période commence avec `(d, f)`.

Après la boucle, la dernière période n'a pas encore été comptée : on le fait avant d'afficher.

Pourquoi le tri suffit-il ? Après le tri, aucun créneau plus loin dans la liste ne peut commencer avant `d`. Si `d` est après `fin`, aucun créneau restant ne pourra donc boucher le trou entre `fin` et `d` : la période en cours est bel et bien terminée.

Les pièges :
- remplacer la fin par `f` au lieu de prendre le maximum : dans le deuxième exemple, le créneau `(20, 30)` est entièrement dans `(5, 100)`, et la période va jusqu'à 100, puis jusqu'à 110 grâce à `(90, 110)` ;
- utiliser `<` au lieu de `<=` : deux créneaux qui se touchent ne laissent pas de trou ;
- oublier la dernière période, ou oublier de trier : les créneaux sont donnés dans le désordre.

Le tri prend l'essentiel du temps, et le parcours qui suit ne regarde chaque créneau qu'une fois.
