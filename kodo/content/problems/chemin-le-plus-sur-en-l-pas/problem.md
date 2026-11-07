---
id: chemin-le-plus-sur-en-l-pas
title: Chemin le plus sûr en L pas
chapter: n4-defis
order: 1
tags: [dichotomie, parcours-en-largeur, grilles]
samples: 2
time_limit_ms: 250
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient un entier positif ou nul dans chaque case : sa **sûreté**. Une case de sûreté `0` est interdite.

Tu pars de la case en haut à gauche et tu dois atteindre la case en bas à droite en **au plus `L` déplacements**. Un déplacement mène d'une case à une case voisine (haut, bas, gauche, droite) qui n'est pas interdite. La sûreté d'un chemin est la plus petite sûreté des cases qu'il visite, départ et arrivée compris.

Écris un programme qui calcule la plus grande sûreté possible d'un chemin, ou affiche `-1` si l'arrivée ne peut pas être atteinte en au plus `L` déplacements.

## Entrée
- La première ligne contient trois entiers `R`, `C` et `L`.
- Les `R` lignes suivantes contiennent chacune `C` entiers : les sûretés des cases.

Les cases de départ et d'arrivée ne sont pas interdites.

## Sortie
Un seul entier : la plus grande sûreté d'un chemin d'au plus `L` déplacements, ou `-1`.

## Contraintes
- 1 ≤ R, C ≤ 150
- 0 ≤ L ≤ R × C
- 0 ≤ sûreté ≤ 99 999

## Indices
1. Fixe un seuil `s`. Existe-t-il un chemin d'au plus `L` déplacements qui ne passe que par des cases de sûreté au moins `s` ? Un parcours en largeur répond en O(R × C).
2. Si la réponse est oui pour `s`, elle l'est aussi pour tout seuil plus petit. Cherche le plus grand bon seuil par dichotomie.
3. La réponse est toujours une des valeurs de la grille : fais la dichotomie sur la liste triée des valeurs distinctes, environ 15 parcours en largeur.

## Solution
**Fixer la réponse.** Pour un seuil `s`, ne gardons que les cases de sûreté au moins `s`. Un chemin de sûreté au moins `s` est un chemin dans ces cases. Le plus court se trouve par un **parcours en largeur** depuis le départ : la réponse au test est « oui » si l'arrivée est à au plus `L` pas.

**Dichotomie.** Baisser le seuil ne retire aucune case : si le test réussit pour `s`, il réussit pour tout `s' < s`. La sûreté du meilleur chemin est la plus grande valeur `s` pour laquelle le test réussit. Elle fait partie des valeurs de la grille, puisque c'est la sûreté d'une case. On trie les valeurs distinctes et on cherche par dichotomie la dernière qui réussit. Si même la plus petite échoue, la réponse est `-1`.

Complexité : **O(R × C × log(R × C))**, environ 15 parcours en largeur de 22 500 cases.

Pourquoi les idées simples échouent :
- Essayer tous les seuils un par un coûte un parcours par valeur distincte, soit jusqu'à 22 500 parcours. Un test place le départ dans une grande zone, fermée par une seule porte de sûreté moyenne : chaque essai reparcourt toute la zone.
- Le « chemin de sûreté maximale » sans limite de longueur (variante de Dijkstra, ou union-find par valeurs décroissantes) ignore `L`. Le meilleur chemin peut être trop long, et un test exige un compromis entre longueur et sûreté.
- Un parcours sur les états (case, nombre de pas) coûte O(R × C × L) : beaucoup trop.

Pièges :
- Arrête le parcours dès que la distance atteint `L` sans être arrivé, mais vérifie l'arrivée au moment où tu **ajoutes** une case à la file : plusieurs cases sont à la distance `L`, et l'arrivée n'est pas forcément la première.
- Avec `R = C = 1`, le départ est l'arrivée : la réponse est sa sûreté, même pour `L = 0`.
