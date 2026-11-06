---
id: sac-a-dos-de-poids-exact
title: Sac à dos de poids exact
chapter: n4-dynamique
order: 3
tags: [programmation-dynamique]
samples: 2
---

## Énoncé
On dispose de `N` objets ; chacun a un poids et une valeur.

Écris un programme qui choisit des objets, chacun au plus une fois, dont le poids total vaut **exactement** `W`, en maximisant la somme de leurs valeurs. Si aucun choix d'objets ne pèse exactement `W`, affiche `-1`.

## Entrée
- La première ligne contient deux entiers `N` et `W`.
- Chacune des `N` lignes suivantes contient deux entiers : le poids `P` d'un objet et sa valeur `V`.

## Sortie
Un seul entier : la valeur totale maximale d'une sélection de poids exactement `W`, ou `-1` s'il n'en existe aucune.

## Contraintes
- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10 000
- 1 ≤ P ≤ 10 000
- 0 ≤ V ≤ 1 000

## Indices
1. Il y a 2¹⁰⁰ façons de choisir des objets. En revanche, il n'y a que `W + 1` poids totaux possibles entre `0` et `W`.
2. Traite les objets un par un, en tenant à jour `meilleur[w]` : la meilleure valeur d'une sélection de poids exactement `w` avec les objets déjà traités. Comment un nouvel objet de poids `P` et de valeur `V` modifie-t-il ce tableau ?
3. Au départ, seul `meilleur[0] = 0` est possible : les autres cases doivent valoir « impossible » (par exemple `-1`), pas `0`. Pour chaque objet, parcours `w` de `W` jusqu'à `P` en **décroissant**, pour ne pas utiliser deux fois le même objet.

## Solution
C'est le problème du **sac à dos**, avec une contrainte d'égalité. On note `meilleur[w]` la meilleure valeur d'une sélection de poids exactement `w`, en n'utilisant que les objets déjà examinés, ou `-1` si aucune sélection ne pèse `w`.

- Au départ (aucun objet), seule la sélection vide existe : `meilleur[0] = 0` et `meilleur[w] = -1` pour `w > 0`.
- Quand on examine un objet de poids `P` et de valeur `V`, une sélection de poids `w` soit ne le contient pas (valeur `meilleur[w]`), soit le contient et le reste pèse `w - P` (valeur `meilleur[w - P] + V`, si `meilleur[w - P]` n'est pas `-1`). On garde le meilleur des deux.

On parcourt `w` de `W` vers `P` en **décroissant** : ainsi, `meilleur[w - P]` n'a pas encore été modifié pour cet objet, et chaque objet est utilisé au plus une fois. La réponse est `meilleur[W]`.

Complexité : **O(N × W)**, soit 10⁶ opérations au maximum. Essayer tous les sous-ensembles coûterait 2¹⁰⁰ : impossible. Un glouton (prendre d'abord les objets de plus grande valeur, ou les plus « rentables » par unité de poids) ne marche pas non plus : il peut manquer le poids exact ou un meilleur mélange.

Pièges :
- Initialiser tout le tableau à `0` calcule la meilleure valeur pour un poids **au plus** `W`, pas exactement `W`. Sur le premier exemple, on trouverait `90` au lieu de `70`.
- Parcourir `w` dans l'ordre croissant permettrait de prendre plusieurs fois le même objet.
- Un objet de valeur `0` peut être indispensable pour atteindre le poids exact : la réponse peut être `0` sans être `-1`.
