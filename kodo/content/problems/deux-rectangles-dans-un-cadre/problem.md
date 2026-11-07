---
id: deux-rectangles-dans-un-cadre
title: Deux rectangles dans un cadre
chapter: n1-conditions
order: 6
tags: [conditions]
samples: 3
---

## Énoncé
Un cadre rectangulaire mesure `W` de large et `H` de haut. On veut poser à l'intérieur deux rectangles : le premier mesure `A` sur `B`, le second `C` sur `D`.

Les règles sont les suivantes :
- chaque rectangle doit être entièrement à l'intérieur du cadre ;
- les deux rectangles ne doivent pas se chevaucher, mais ils peuvent se toucher par un bord ;
- les côtés des rectangles restent parallèles aux côtés du cadre, mais chaque rectangle peut être tourné d'un quart de tour : un rectangle `A` sur `B` peut aussi être posé comme un rectangle `B` sur `A`.

Écris un programme qui affiche `OUI` si l'on peut poser les deux rectangles dans le cadre, et `NON` sinon.

## Entrée
- La première ligne contient deux entiers `W` et `H` : la largeur et la hauteur du cadre.
- La deuxième ligne contient deux entiers `A` et `B` : les côtés du premier rectangle.
- La troisième ligne contient deux entiers `C` et `D` : les côtés du second rectangle.

## Sortie
Un seul mot : `OUI` si l'on peut poser les deux rectangles, `NON` sinon.

## Contraintes
- 1 ≤ W, H, A, B, C, D ≤ 1 000

## Indices
1. Imagine deux rectangles posés dans le cadre sans se chevaucher. Peux-tu toujours tracer une ligne droite, verticale ou horizontale, qui passe entre les deux ?
2. Il n'y a donc que deux façons de les placer : **côte à côte** (leurs largeurs s'additionnent et doivent tenir dans `W`, et chaque hauteur doit tenir dans `H`), ou **l'un au-dessus de l'autre** (leurs hauteurs s'additionnent et doivent tenir dans `H`, et chaque largeur doit tenir dans `W`).
3. Chaque rectangle peut être posé de deux façons, ce qui fait 4 combinaisons, et pour chacune il y a 2 placements : 8 cas en tout. La réponse est `OUI` si au moins un des 8 cas fonctionne. Tu peux utiliser une variable qui vaut d'abord faux, et qui devient vraie dès qu'un cas fonctionne.

## Solution
La clé du problème est une remarque : deux rectangles qui ne se chevauchent pas, avec des côtés parallèles à ceux du cadre, sont toujours séparés par une ligne verticale ou par une ligne horizontale. En effet, si aucune ligne verticale ne passe entre eux, leurs parties vues « de face » se recouvrent ; si en plus aucune ligne horizontale ne passe entre eux, leurs parties vues « de côté » se recouvrent aussi, et alors les rectangles se chevauchent.

Il suffit donc d'essayer deux placements :
- **côte à côte** : la somme des largeurs est au plus `W`, et chacune des deux hauteurs est au plus `H` ;
- **l'un au-dessus de l'autre** : la somme des hauteurs est au plus `H`, et chacune des deux largeurs est au plus `W`.

Pour chaque rectangle, on choisit aussi son sens : le premier a pour largeur et hauteur `A` et `B`, ou bien `B` et `A` ; de même pour le second. Avec 2 sens pour chaque rectangle et 2 placements, on obtient 8 conditions. On les teste toutes, et on répond `OUI` dès qu'une seule est vraie.

Exemple : un cadre de 7 sur 4, et deux rectangles de 4 sur 3. Posés tels quels côte à côte, ils demandent une largeur de 8 : trop large. L'un au-dessus de l'autre, ils demandent une hauteur de 6 : trop haut. Mais tournés tous les deux, ils mesurent 3 sur 4 : côte à côte, ils occupent une largeur de 6 et une hauteur de 4, et ils tiennent.

Les pièges :
- oublier des cas : il faut bien penser aux rotations des **deux** rectangles, indépendamment l'une de l'autre ;
- utiliser `<` au lieu de `<=` : deux rectangles qui remplissent exactement le cadre, c'est permis ;
- vérifier seulement que la somme des aires est assez petite : deux carrés de 3 sur 3 ont une aire totale de 18, plus petite que les 25 d'un cadre de 5 sur 5, et pourtant ils n'y tiennent pas.
