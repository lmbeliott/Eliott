---
id: chemin-avec-le-moins-de-virages
title: Chemin avec le moins de virages
chapter: n4-graphes
order: 6
tags: [graphes, parcours-en-largeur, grilles]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des cases libres et des murs, une case de départ `S` et une case d'arrivée `T`. On se déplace d'une case à une case voisine (haut, bas, gauche ou droite), sans jamais entrer dans un mur ni sortir de la grille.

Un **virage** est un changement de direction entre deux déplacements consécutifs. La direction du premier déplacement est libre et ne compte pas comme un virage.

Écris un programme qui calcule le nombre minimal de virages d'un chemin de `S` à `T`, ou qui affiche `-1` s'il n'existe aucun chemin. La longueur du chemin n'a pas d'importance.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un mur, `S` pour le départ et `T` pour l'arrivée.

La grille contient exactement un `S` et un `T`, qui se comportent comme des cases libres.

## Sortie
Un seul entier : le nombre minimal de virages, ou `-1` si l'arrivée est inaccessible.

## Contraintes
- 1 ≤ R, C ≤ 200
- 2 ≤ R × C

## Indices
1. Le plus court chemin en nombre de cases n'est pas forcément celui qui tourne le moins. Et la case seule ne suffit pas à décrire la situation : pour savoir si le prochain pas coûte un virage, il faut connaître la direction dans laquelle on va.
2. Prends comme sommets les **états** `(case, direction)`. Avancer d'une case tout droit coûte `0` virage ; tourner d'un quart de tour sur place coûte `1`. On cherche un plus court chemin dans un graphe dont les arêtes valent `0` ou `1`.
3. Le **BFS 0-1** résout ce cas : une file à double entrée, où l'on ajoute à l'**avant** les états atteints par une arête de coût `0` et à l'**arrière** ceux atteints par une arête de coût `1`.

## Solution
On construit un graphe d'**états** : un état est un couple `(case, direction)`, avec quatre directions, soit au plus `4 × R × C = 160 000` états. Depuis l'état `(x, d)` :
- avancer : si la case suivante `y` dans la direction `d` est libre, on passe à `(y, d)` pour un coût `0` ;
- tourner : on passe à `(x, d')` pour un coût `1`, où `d'` est l'une des deux directions perpendiculaires à `d`. Un demi-tour n'est jamais utile : il ramène sur des cases déjà vues.

Au départ, les quatre états `(S, d)` sont à distance `0`, puisque la première direction est libre. La réponse est la plus petite distance d'un état `(T, d)`.

Les coûts valent `0` ou `1` : un **BFS 0-1** suffit. On utilise une file à double entrée. Un état atteint par une arête de coût `0` est placé à l'avant, un état atteint par une arête de coût `1` à l'arrière. Ainsi, la file reste triée par distance, comme le tas de Dijkstra, mais chaque opération coûte O(1). Un état peut être ajouté deux fois : on ignore celui qui est retiré alors qu'il a déjà été traité. Le premier état de `T` retiré donne la réponse.

Complexité : **O(R × C)**. L'algorithme de Dijkstra sur le même graphe d'états donne aussi la bonne réponse, avec un facteur `log` en plus.

Pourquoi les idées simples échouent :
- Un BFS classique trouve le chemin le plus court **en cases**, qui peut faire bien plus de virages qu'un détour : dans une grille avec des murs en escalier, un détour par le bord ne tourne que 2 ou 3 fois.
- Garder une seule valeur par case (le nombre minimal de virages pour l'atteindre, avec la direction d'arrivée correspondante) est faux : arriver avec un virage de plus, mais dans la bonne direction, peut économiser des virages ensuite. Dans la grille ci-dessous, la réponse est `1` (descendre, puis aller à droite jusqu'à `T`), mais cette méthode peut trouver `2` : deux arrivées à égalité sur la case en bas à droite de `S`, en diagonale, s'y disputent, et garder la mauvaise direction coûte un virage de plus.

```
#.#..
.S.##
....T
```

- Énumérer les chemins un par un est exponentiel.

Pièges :
- Le premier déplacement ne compte pas comme un virage : les quatre directions de départ sont à distance `0`.
- Avec `sys.stdin.buffer`, chaque ligne de la grille est un objet `bytes` : décode-la, ou compare les éléments avec `ord('#')`.
