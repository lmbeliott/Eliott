---
id: cases-les-plus-proches-de-chaque-source
title: Cases les plus proches de chaque source
chapter: p4-graphes-implicites
order: 5
tags: [grilles, parcours-en-largeur]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des cases libres, des murs et des **sources**, notées par des lettres majuscules ; plusieurs cases peuvent porter la même lettre. On se déplace d'une case à une case voisine (haut, bas, gauche, droite), sans entrer dans un mur.

Pour une case non murée et une lettre `L`, la distance de la case à `L` est le nombre minimal de déplacements pour aller de la case à l'une des cases marquées `L`. Une case **appartient** à la lettre `L` si sa distance à `L` est strictement plus petite que sa distance à toute autre lettre. Une case qu'aucune lettre ne peut atteindre n'appartient à personne ; une case dont la plus petite distance est atteinte par plusieurs lettres est **disputée**.

Pour chaque lettre présente dans la grille, compter les cases qui lui appartiennent (ses propres sources comprises), puis compter les cases disputées.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un mur, une lettre majuscule pour une source.

La grille contient au moins une source.

## Sortie
- Une ligne par lettre présente dans la grille, dans l'ordre alphabétique : la lettre, une espace, puis le nombre de cases qui lui appartiennent.
- Puis une dernière ligne : le nombre de cases disputées.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Faire un parcours en largeur par lettre coûte jusqu'à 26 parcours de la grille. Un seul parcours suffit, s'il part de **toutes** les sources à la fois.
2. Dans ce parcours, chaque case retient sa distance et son « propriétaire » : une lettre, ou « disputée ». Que faire quand on atteint une case déjà découverte, à la même distance, depuis un autre propriétaire ?
3. Une case à distance `d + 1` est disputée exactement quand ses voisines à distance `d` n'ont pas toutes le même propriétaire, ou que l'une d'elles est disputée.

## Solution
On fait un **parcours en largeur à sources multiples** : au départ, toutes les sources sont dans la file, à distance 0, chacune avec sa lettre comme propriétaire. La distance obtenue pour chaque case est la plus petite distance à une source, toutes lettres confondues (c'est le parcours du cours, avec un « super-départ » relié à toutes les sources).

Le propriétaire se propage ainsi : quand on défile `u` et qu'on examine une voisine `v` :
- si `v` n'est pas découverte, elle reçoit `dist[u] + 1` et le propriétaire de `u` ;
- si `v` est déjà découverte avec `dist[v] = dist[u] + 1` et un propriétaire différent de celui de `u`, elle devient disputée.

**Pourquoi c'est juste.** Appelons « lettres les plus proches » de `v` l'ensemble des lettres qui réalisent sa distance minimale `D(v)`. Pour `D(v) ≥ 1`, une lettre est parmi les plus proches de `v` si et seulement si elle est parmi les plus proches d'une voisine `u` avec `D(u) = D(v) − 1` : il suffit de regarder l'avant-dernière case d'un plus court chemin. L'ensemble de `v` est donc la réunion des ensembles de ses voisines de la couche précédente. Le parcours traite toutes les cases à distance `d` avant de défiler une case à distance `d + 1` : quand `v` est défilée, elle a reçu la contribution de toutes ses voisines de la couche précédente, et son propriétaire est la lettre unique de cette réunion, ou « disputée » si la réunion contient au moins deux lettres.

**Complexité.** Un seul parcours : O(R × C), au lieu de 26 parcours.
