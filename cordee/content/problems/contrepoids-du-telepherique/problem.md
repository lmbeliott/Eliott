---
id: contrepoids-du-telepherique
title: Le contrepoids du téléphérique
chapter: n4-dynamique
order: 3
tags: [programmation-dynamique]
samples: 2
---

## Énoncé
Chaque matin, la petite benne de ravitaillement du téléphérique monte des colis au refuge des Aiguilles. Elle est équilibrée par un contrepoids fixe : pour que le câble reste en sécurité, elle doit être chargée avec **exactement** `W` kilogrammes, ni plus ni moins. Sofia, la gardienne du refuge, a `N` colis en attente ; chacun a un poids et une utilité (les vivres frais sont plus utiles que les cartes postales).

Écris un programme qui choisit des colis, chacun au plus une fois, dont le poids total vaut exactement `W`, en maximisant la somme de leurs utilités. Si aucun choix de colis ne pèse exactement `W` kilogrammes, affiche `-1`.

## Entrée
- La première ligne contient deux entiers `N` et `W`.
- Chacune des `N` lignes suivantes contient deux entiers : le poids `P` d'un colis, en kilogrammes, et son utilité `U`.

## Sortie
Un seul entier : l'utilité totale maximale d'un chargement de exactement `W` kilogrammes, ou `-1` s'il n'en existe aucun.

## Contraintes
- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10 000
- 1 ≤ P ≤ 10 000
- 0 ≤ U ≤ 1 000

## Indices
1. Il y a 2¹⁰⁰ façons de choisir des colis. En revanche, il n'y a que `W + 1` poids totaux possibles entre `0` et `W`.
2. Traite les colis un par un, en tenant à jour `meilleur[w]` : la meilleure utilité d'un chargement d'exactement `w` kilogrammes avec les colis déjà traités. Comment un nouveau colis de poids `P` et d'utilité `U` modifie-t-il ce tableau ?
3. Au départ, seul `meilleur[0] = 0` est possible : les autres cases doivent valoir « impossible » (par exemple `-1`), pas `0`. Pour chaque colis, parcours `w` de `W` jusqu'à `P` en **décroissant**, pour ne pas utiliser deux fois le même colis.

## Solution
C'est le problème du **sac à dos**, avec une contrainte d'égalité. On note `meilleur[w]` la meilleure utilité d'un chargement pesant exactement `w` kilogrammes, en n'utilisant que les colis déjà examinés, ou `-1` si aucun chargement ne pèse `w`.

- Au départ (aucun colis), seul le chargement vide existe : `meilleur[0] = 0` et `meilleur[w] = -1` pour `w > 0`.
- Quand on examine un colis de poids `P` et d'utilité `U`, un chargement de `w` kilogrammes soit ne le contient pas (utilité `meilleur[w]`), soit le contient et le reste pèse `w - P` (utilité `meilleur[w - P] + U`, si `meilleur[w - P]` n'est pas `-1`). On garde le meilleur des deux.

On parcourt `w` de `W` vers `P` en **décroissant** : ainsi, `meilleur[w - P]` n'a pas encore été modifié pour ce colis, et chaque colis est utilisé au plus une fois. La réponse est `meilleur[W]`.

Complexité : **O(N × W)**, soit 10⁶ opérations au maximum. Essayer tous les sous-ensembles coûterait 2¹⁰⁰ : impossible. Un glouton (prendre d'abord les colis les plus utiles, ou les plus « rentables » par kilogramme) ne marche pas non plus : il peut manquer le poids exact ou un meilleur mélange.

Pièges :
- Initialiser tout le tableau à `0` calcule la meilleure utilité pour un poids **au plus** `W`, pas exactement `W`. Sur le premier exemple, on trouverait `90` au lieu de `70`.
- Parcourir `w` dans l'ordre croissant permettrait de prendre plusieurs fois le même colis.
- Un colis d'utilité `0` peut être indispensable pour atteindre le poids exact : la réponse peut être `0` sans être `-1`.
