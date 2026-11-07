---
id: couleurs-d-une-composante
title: Couleurs d'une composante
chapter: n4-defis
order: 4
tags: [union-find, graphes, tri]
samples: 2
---

## Énoncé
Un graphe a `N` sommets numérotés de `1` à `N` et `M` arêtes. Le sommet `i` a une couleur `c[i]`. Chaque arête relie deux sommets `u` et `v` et a un poids `w`. Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

On pose `Q` questions. La question `(v, t)` est : en ne gardant que les arêtes de poids **au plus** `t`, combien de couleurs différentes y a-t-il dans la composante connexe du sommet `v` ?

Écris un programme qui répond à toutes les questions.

## Entrée
La première ligne contient quatre entiers `N`, `M`, `Q` et `G`.

**Si `G = 0`**, les données sont écrites en entier :
- la deuxième ligne contient les `N` couleurs `c[1]`, …, `c[N]` ;
- les `M` lignes suivantes contiennent chacune trois entiers `u`, `v` et `w` : une arête ;
- les `Q` lignes suivantes contiennent chacune deux entiers `v` et `t` : une question.

**Si `G > 0`**, la deuxième ligne contient quatre entiers `A`, `B`, `W` et `K`, et les données sont produites par un générateur. On part de `x = G`, et chaque appel à `suivant()` fait :
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴` ;
- puis renvoie `x` divisé par `2³³` (division entière).

Dans cet ordre :
- pour `i` de `1` à `N` : `c[i] = 1 + (suivant() mod K)` ;
- pour chaque arête : `u = 1 + (suivant() mod A)`, puis `v = 1 + (suivant() mod B)`, puis `w = 1 + (suivant() mod W)` ;
- pour chaque question : `v = 1 + (suivant() mod N)`, puis `t = 1 + (suivant() mod W)`.

Dans le deuxième exemple (`G = 3`), les couleurs sont `4 4 4 3 1 4` et la première arête relie `2` et `6` avec le poids `9`. En C++, le calcul modulo 2⁶⁴ est automatique avec `unsigned long long`. En Python, utilise `% 2**64`.

## Sortie
`Q` lignes : la réponse à chaque question, dans l'ordre.

## Contraintes
- 1 ≤ N ≤ 50 000
- 1 ≤ M, Q ≤ 100 000
- 1 ≤ c[i] ≤ N
- 1 ≤ w, t ≤ 10⁹
- 1 ≤ A, B ≤ N, 1 ≤ W ≤ 10⁹ et 1 ≤ K ≤ N

## Indices
1. Si on répond aux questions par `t` croissant, les arêtes ne font que s'ajouter. Trie les arêtes et les questions, et fusionne les composantes avec union-find : c'est un traitement **hors ligne**.
2. Il faut aussi connaître les couleurs de chaque composante. Garde un ensemble de couleurs par racine et réunis les ensembles lors d'une fusion.
3. Réunir naïvement peut coûter O(N²) : un grand ensemble recopié à chaque fois. Verse toujours le **plus petit** ensemble dans le plus grand. Un élément ne change alors d'ensemble que si la taille de son ensemble au moins double, donc au plus log₂ N fois.

## Solution
**Hors ligne.** Les questions ne dépendent que des arêtes de poids `≤ t`. On les traite par `t` croissant, après avoir trié les arêtes par poids. Avant de répondre à `(v, t)`, on ajoute toutes les arêtes de poids `≤ t` pas encore ajoutées. Les composantes se gèrent avec **union-find**. On répond dans l'ordre du tri, puis on affiche les réponses dans l'ordre de l'entrée.

**Les couleurs.** Chaque racine garde l'ensemble des couleurs de sa composante, et la réponse est la taille de cet ensemble. Quand deux composantes fusionnent, on verse un ensemble dans l'autre.

**Petit dans grand.** On verse toujours le plus petit ensemble dans le plus grand. Une couleur copiée passe dans un ensemble au moins deux fois plus grand que celui qu'elle quitte. Une même entrée ne peut donc être copiée que `log₂ N` fois, et le total des copies est O(N log N). Le plus simple est de faire de la racine du plus grand ensemble la nouvelle racine.

Complexité : **O((M + Q) log(M + Q) + N log N)** pour les tris et les copies (avec un ensemble trié en C++, un facteur `log N` en plus).

Pourquoi les idées simples échouent :
- Un parcours du graphe par question coûte O(N + M) par question, soit 10¹⁰ opérations au total.
- Verser l'ensemble de la première extrémité de l'arête dans celui de la seconde (ou toujours l'inverse) marche mal sur une étoile. Le grand ensemble central est recopié à chaque nouvelle feuille, soit environ N²/2 = 1,25 × 10⁹ copies. Deux tests sont des étoiles, une dans chaque sens.

Pièges :
- `t` est inclusif : une arête de poids exactement `t` est gardée.
- Une arête dont les deux extrémités sont déjà dans la même composante ne change rien (et une boucle `u = v` non plus).
- Garde l'indice d'origine de chaque question pour afficher les réponses dans l'ordre.
