---
id: cols-enneiges
title: Les cols enneigés
chapter: n4-chemins
order: 2
tags: [graphes, union-find, tri]
samples: 2
---

## Énoncé
Au printemps, la neige fond peu à peu dans la vallée de Valcorde et la **limite de l'enneigement** remonte de semaine en semaine. Chaque sentier entre deux refuges franchit un col : il n'est praticable que si l'altitude de ce col est inférieure ou égale à la limite de l'enneigement.

Malik, à l'office des guides, reçoit des questions de randonneurs : « Si la limite de l'enneigement est à l'altitude `S`, peut-on aller du refuge `X` au refuge `Y`, en passant éventuellement par d'autres refuges ? » Écris un programme qui répond à toutes les questions.

## Entrée
- La première ligne contient trois entiers `N`, `M` et `Q` : le nombre de refuges (numérotés de `1` à `N`), de sentiers et de questions.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `H` : un sentier relie les refuges `A` et `B`, dans les deux sens, en franchissant un col d'altitude `H`.
- Chacune des `Q` lignes suivantes contient trois entiers `X`, `Y` et `S` : une question.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre de l'entrée, `OUI` si l'on peut aller de `X` à `Y` en n'empruntant que des sentiers dont le col est à une altitude inférieure ou égale à `S`, et `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 5 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A, B, X, Y ≤ N
- 500 ≤ H, S ≤ 4 800

## Indices
1. Pour une seule question, un parcours de graphe suffit. Mais un parcours par question, c'est jusqu'à 5 000 parcours du graphe entier.
2. Si l'on traite les questions par limite `S` croissante, les sentiers praticables ne font que s'**ajouter**, jamais disparaître. Quelle structure sait fusionner des groupes et dire si deux éléments sont dans le même groupe ?
3. Trie les sentiers par altitude du col et les questions par `S`. Pour chaque question, ajoute dans un union-find tous les sentiers de col `≤ S` pas encore ajoutés, puis compare les représentants de `X` et `Y`. Range la réponse à la position d'origine de la question.

## Solution
Pour une limite `S` donnée, la question est de savoir si `X` et `Y` sont dans la même composante connexe du graphe des sentiers praticables. Un parcours en largeur par question coûte O(Q × (N + M)), soit 5 × 10⁷ opérations : trop lent en Python.

L'observation clé : quand `S` augmente, l'ensemble des sentiers praticables **grandit**. On répond donc aux questions **hors ligne**, dans l'ordre des `S` croissants, et non dans l'ordre de l'entrée :

1. on trie les sentiers par altitude `H` du col ;
2. on trie les numéros des questions par `S` ;
3. pour chaque question, on fusionne dans un **union-find** les deux extrémités de chaque sentier de col `H ≤ S` pas encore ajouté (un pointeur avance dans la liste triée des sentiers) ;
4. on répond `OUI` si `X` et `Y` ont le même représentant, et on range la réponse à l'indice d'origine de la question.

L'union-find garde, pour chaque refuge, un parent ; la racine de l'arbre est le représentant du groupe. Avec la **compression des chemins** et l'**union par taille**, chaque opération coûte un temps quasi constant. La complexité totale est **O(M log M + Q log Q)**, dominée par les tris.

Pièges :
- La comparaison est large : un sentier dont le col est exactement à l'altitude `S` est praticable. Il faut ajouter **tous** les sentiers de col `≤ S` avant de répondre.
- Les réponses doivent être affichées dans l'ordre de l'entrée : garde l'indice de chaque question.
- Si `X = Y`, la réponse est toujours `OUI`.
- Sans l'union par taille, les arbres de l'union-find peuvent devenir très profonds, et un `find` récursif risque de dépasser la limite de récursion de Python. Avec l'union par taille, la profondeur reste inférieure à log₂ N ; écrire `find` avec une boucle évite de toute façon le problème.
