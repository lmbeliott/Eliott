---
id: plus-long-ecart-entre-deux-dates
title: Plus long écart entre deux dates
chapter: n2-fonctions
order: 3
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
Un registre contient une liste de dates, rangées dans l'ordre chronologique.

Écris un programme qui affiche le plus grand nombre de jours entre deux dates **consécutives** du registre. Par exemple, entre le `28/02/2023` et le `01/03/2023`, il y a 1 jour ; entre le `15/07/2024` et le `01/09/2024`, il y en a 48.

Attention aux années bissextiles, où février a 29 jours. Une année est bissextile si elle est divisible par 4, sauf si elle est divisible par 100 sans l'être par 400 : `2024` et `2000` sont bissextiles, mais `1900`, `2023` et `2100` ne le sont pas.

## Entrée
- La première ligne contient un entier `N` : le nombre de dates.
- Les `N` lignes suivantes contiennent chacune une date sous la forme `jj/mm/aaaa`, dans l'ordre chronologique. Une même date peut apparaître plusieurs fois à la suite.

## Sortie
Un seul entier : le plus grand nombre de jours entre deux dates consécutives du registre.

## Contraintes
- 2 ≤ N ≤ 100
- Toutes les dates existent, et sont comprises entre le `01/01/1900` et le `31/12/2100`.

## Indices
1. Compter les jours entre deux dates directement est compliqué. Plus simple : donne à chaque date un **numéro**, le nombre de jours écoulés depuis le `01/01/1900`. Le nombre de jours entre deux dates est alors la différence de leurs numéros.
2. Découpe en petites fonctions : `est_bissextile(a)`, puis `jours_dans_mois(m, a)` qui s'en sert pour février, puis `numero(j, m, a)` qui additionne les jours de toutes les années complètes depuis 1900, puis ceux des mois complets de l'année `a`, puis les jours du mois.
3. Une fois les numéros calculés, il reste à trouver le plus grand écart entre deux numéros qui se suivent : garde le numéro de la date précédente dans une variable.

## Solution
On numérote les jours : le `01/01/1900` porte le numéro 0, le `02/01/1900` le numéro 1, et ainsi de suite. Pour calculer le numéro d'une date `j/m/a`, on additionne :
- 365 ou 366 jours pour chaque année complète de 1900 à `a - 1` ;
- les jours de chaque mois complet de l'année `a`, de janvier au mois `m - 1` ;
- `j - 1` jours dans le mois `m`.

Le nombre de jours entre deux dates est la différence de leurs numéros. Il reste à parcourir le registre en gardant le numéro de la date précédente, et à retenir le plus grand écart.

Ce problème montre bien l'intérêt des fonctions : `est_bissextile` sert à la fois pour les années complètes et pour février, et `jours_dans_mois` cache tous les détails du calendrier. Chaque fonction est courte et se vérifie séparément (`est_bissextile(1900)` doit valoir faux).

Les pièges :
- la règle des siècles : `1900` et `2100` ne sont pas bissextiles, mais `2000` l'est ;
- pour février, c'est l'année **de la date** qui compte, pas une autre ;
- deux dates identiques sont à 0 jour d'écart, et ce n'est pas une erreur ;
- pour lire `14/07/2025` : en Python, `input().split("/")` découpe la ligne aux `/`. En C++, on peut lire `cin >> j >> c >> m >> c >> a` avec une variable `char c` qui récupère les `/`.
