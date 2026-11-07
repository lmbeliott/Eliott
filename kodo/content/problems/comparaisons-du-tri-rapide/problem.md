---
id: comparaisons-du-tri-rapide
title: Comparaisons du tri rapide
chapter: p4-diviser-regner
order: 8
synthesis: true
tags: [récursivité, mathématiques, tri]
samples: 2
---

## Énoncé
On trie une liste de nombres distincts par la version suivante du **tri rapide**. Si la liste a au plus un élément, elle est triée. Sinon, son **premier** élément est le pivot p ; on compare p à chacun des autres éléments, ce qui fait (longueur − 1) comparaisons, et on forme la liste G des éléments plus petits que p et la liste D des éléments plus grands, chacune **dans l'ordre où ses éléments apparaissaient**. On trie G et D de la même façon, et le résultat est G triée, puis p, puis D triée.

Par exemple, pour `3 1 4 2 5`, le pivot 3 fait 4 comparaisons et donne G = `1 2` et D = `4 5`. Trier G fait 1 comparaison, trier D aussi : 6 comparaisons en tout.

La liste est une permutation des entiers de 1 à N, fabriquée par une formule : son élément numéro i, pour i de 0 à N − 1, vaut ((A × i + B) mod N) + 1, où A et N n'ont pas de diviseur commun autre que 1. Afficher le nombre total de comparaisons.

## Entrée
Une seule ligne : les trois entiers N, A et B.

## Sortie
Le nombre total de comparaisons faites par le tri rapide.

## Contraintes
- 1 ≤ N ≤ 200 000
- 0 ≤ A, B < N, et PGCD(A, N) = 1

## Indices
1. Simuler le tri coûte jusqu'à N²/2 comparaisons, par exemple quand la liste est déjà triée, avec une profondeur de récursion égale à N : trop lent et trop profond.
2. Deux valeurs x < y sont comparées au plus une fois. Elles restent dans la même sous-liste tant qu'aucun pivot n'a été choisi parmi x, x + 1, …, y. Lequel de ces nombres devient pivot en premier ?
3. x et y sont comparés si et seulement si, parmi les valeurs x, x + 1, …, y, celle qui apparaît la première dans la liste de départ est x ou y. Pour chaque x, compter les y qui conviennent revient à chercher la prochaine valeur plus grande que x qui apparaît avant x : une pile monotone.

## Solution
**Quand deux valeurs sont-elles comparées ?** Une comparaison a toujours lieu entre un pivot et un autre élément de sa sous-liste, et un pivot n'appartient plus à aucune sous-liste ensuite : deux valeurs sont comparées au plus une fois. Prenons x < y. Tant que le pivot choisi n'est pas entre x et y, toutes les valeurs x, x + 1, …, y vont du même côté : elles restent ensemble. Les sous-listes gardent l'ordre de départ, donc le pivot d'une sous-liste est celui de ses éléments qui apparaît le premier dans la liste de départ. Le premier pivot choisi parmi x, …, y est donc celle de ces valeurs qui apparaît la première. Si c'est x ou y, ils sont comparés ; sinon, ce pivot les envoie de deux côtés différents, et ils ne le seront jamais.

**Compter.** Notons pos[v] la position de la valeur v dans la liste. La paire x < y est comparée si pos[x] est le minimum de pos[x], …, pos[y], ou si pos[y] l'est (les deux ne peuvent pas arriver ensemble). Pour x fixé, la première condition est vraie pour y = x + 1, x + 2, …, jusqu'à la première valeur z > x telle que pos[z] < pos[x], exclue : cela fait z − x − 1 valeurs (avec z = N + 1 s'il n'y en a pas). De même, pour y fixé, la seconde est vraie pour les x situés après la dernière valeur w < y telle que pos[w] < pos[y] : y − w − 1 valeurs (avec w = 0 s'il n'y en a pas). La réponse est la somme de toutes ces quantités.

**Pile monotone.** Pour chaque v, la prochaine valeur plus grande dont la position est plus petite se trouve pour tous les v en un seul passage avec une pile, comme le « prochain élément plus petit » du niveau 3, appliqué au tableau pos ; de même pour la précédente. Le calcul de pos, les deux passages et la somme coûtent O(N). La réponse peut atteindre N(N − 1)/2 ≈ 2 × 10¹⁰ : `long long` en C++.
