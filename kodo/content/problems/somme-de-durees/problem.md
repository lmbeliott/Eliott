---
id: somme-de-durees
title: Somme de durées
chapter: n2-fonctions
order: 1
tags: [fonctions, chaînes, arithmétique]
samples: 2
---

## Énoncé
Une personne note, pour chaque jour de travail, l'heure à laquelle elle commence et l'heure à laquelle elle termine. Elle veut connaître son temps de travail total.

Les heures sont écrites sous la forme `hh:mm` : par exemple `08:05` pour 8 heures et 5 minutes.

Écris un programme qui affiche ce temps total, sous la même forme `hh:mm`.

## Entrée
- La première ligne contient un entier `N` : le nombre de jours de travail.
- Les `N` lignes suivantes contiennent chacune deux horaires `hh:mm` séparés par une espace : l'heure de début, puis l'heure de fin du même jour. La fin n'a jamais lieu avant le début.

## Sortie
Le temps total, sous la forme `hh:mm` : le nombre d'heures, écrit avec au moins deux chiffres (avec un `0` devant s'il n'a qu'un chiffre), puis `:`, puis le nombre de minutes, toujours écrit avec deux chiffres. Par exemple : `07:05`, `00:15` ou `125:40`.

## Contraintes
- 1 ≤ N ≤ 100
- Les horaires vont de `00:00` à `23:59`.

## Indices
1. Il est bien plus simple de calculer avec des minutes qu'avec des heures et des minutes. Écris une fonction `en_minutes(horaire)` qui transforme `"08:45"` en `525` (8 × 60 + 45).
2. Dans `"08:45"`, les heures sont les caractères d'indices `0` et `1`, les minutes ceux d'indices `3` et `4`. En Python, `int(horaire[0:2])` donne les heures. En C++, `(horaire[0] - '0') * 10 + (horaire[1] - '0')`.
3. Pour l'affichage, écris une fonction `deux_chiffres(n)` qui renvoie `"07"` pour `7` et `"45"` pour `45`, puis une fonction `en_texte(duree)` qui l'utilise deux fois : pour les heures (`duree // 60`) et pour les minutes (`duree % 60`).

## Solution
On découpe le problème en trois petites fonctions :
- `en_minutes(horaire)` transforme un horaire `hh:mm` en un nombre de minutes depuis minuit ;
- `deux_chiffres(n)` écrit un nombre avec au moins deux chiffres, en ajoutant un `0` devant s'il est plus petit que 10 ;
- `en_texte(duree)` transforme un nombre de minutes en texte `hh:mm` : les heures sont `duree // 60` (division entière, `/` sur des `int` en C++) et les minutes `duree % 60`.

Le programme principal devient alors très court : pour chaque jour, on ajoute `en_minutes(fin) - en_minutes(debut)` au total, puis on affiche `en_texte(total)`.

Chaque fonction se teste et se comprend toute seule, et `en_minutes` sert deux fois par ligne : c'est tout l'intérêt des fonctions.

Les pièges :
- soustraire les heures et les minutes séparément : de `09:50` à `10:05`, cela donnerait 1 heure et −45 minutes ! En passant tout en minutes, le problème disparaît ;
- oublier le `0` devant les minutes : `8:5` au lieu de `08:05` ;
- croire que le total tient en 24 heures : sur beaucoup de jours, il peut dépasser 100 heures. Le nombre d'heures n'est pas limité à deux chiffres.
