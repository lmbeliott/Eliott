---
id: connexite-sous-un-seuil
title: Connexité sous un seuil
chapter: n4-chemins
order: 2
tags: [graphes, union-find, tri]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes ; chaque arête a un poids. Pour un seuil `S`, seules les arêtes de poids inférieur ou égal à `S` peuvent être empruntées.

Écris un programme qui répond à `Q` questions de la forme : « Avec le seuil `S`, peut-on aller du sommet `X` au sommet `Y`, en passant éventuellement par d'autres sommets ? »

## Entrée
- La première ligne contient trois entiers `N`, `M` et `Q` : le nombre de sommets (numérotés de `1` à `N`), d'arêtes et de questions.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `H` : une arête de poids `H` relie les sommets `A` et `B`.
- Chacune des `Q` lignes suivantes contient trois entiers `X`, `Y` et `S` : une question.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre de l'entrée, `OUI` si l'on peut aller de `X` à `Y` en n'empruntant que des arêtes de poids inférieur ou égal à `S`, et `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 5 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A, B, X, Y ≤ N
- 500 ≤ H, S ≤ 4 800

## Indices
1. Pour une seule question, un parcours de graphe suffit. Mais un parcours par question, c'est jusqu'à 5 000 parcours du graphe entier.
2. Si l'on traite les questions par seuil `S` croissant, les arêtes utilisables ne font que s'**ajouter**, jamais disparaître. Quelle structure sait fusionner des groupes et dire si deux éléments sont dans le même groupe ?
3. Trie les arêtes par poids et les questions par `S`. Pour chaque question, ajoute dans un union-find toutes les arêtes de poids `≤ S` pas encore ajoutées, puis compare les représentants de `X` et `Y`. Range la réponse à la position d'origine de la question.

## Solution
Pour un seuil `S` donné, la question est de savoir si `X` et `Y` sont dans la même composante connexe du graphe formé par les arêtes de poids `≤ S`. Un parcours en largeur par question coûte O(Q × (N + M)), soit 5 × 10⁷ opérations : trop lent en Python.

L'observation clé : quand `S` augmente, l'ensemble des arêtes utilisables **grandit**. On répond donc aux questions **hors ligne**, dans l'ordre des `S` croissants, et non dans l'ordre de l'entrée :

1. on trie les arêtes par poids `H` ;
2. on trie les numéros des questions par `S` ;
3. pour chaque question, on fusionne dans un **union-find** les deux extrémités de chaque arête de poids `H ≤ S` pas encore ajoutée (un pointeur avance dans la liste triée des arêtes) ;
4. on répond `OUI` si `X` et `Y` ont le même représentant, et on range la réponse à l'indice d'origine de la question.

L'union-find garde, pour chaque sommet, un parent ; la racine de l'arbre est le représentant du groupe. Avec la **compression des chemins** et l'**union par taille**, chaque opération coûte un temps quasi constant. La complexité totale est **O(M log M + Q log Q)**, dominée par les tris.

Pièges :
- La comparaison est large : une arête de poids exactement `S` est utilisable. Il faut ajouter **toutes** les arêtes de poids `≤ S` avant de répondre.
- Les réponses doivent être affichées dans l'ordre de l'entrée : garde l'indice de chaque question.
- Si `X = Y`, la réponse est toujours `OUI`.
- Sans l'union par taille, les arbres de l'union-find peuvent devenir très profonds, et un `find` récursif risque de dépasser la limite de récursion de Python. Avec l'union par taille, la profondeur reste inférieure à log₂ N ; écrire `find` avec une boucle évite de toute façon le problème.
