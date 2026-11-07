---
id: somme-de-nombres-de-fibonacci
title: Somme de nombres de Fibonacci
chapter: p4-gloutons
order: 3
tags: [glouton, mathématiques]
samples: 1
---

## Énoncé
On appelle ici **nombres de Fibonacci** les nombres 1, 2, 3, 5, 8, 13, 21, … : les deux premiers sont 1 et 2, et chacun des suivants est la somme des deux précédents.

Tout entier N ≥ 1 peut s'écrire comme une somme de nombres de Fibonacci, en utilisant éventuellement plusieurs fois le même : par exemple 10 = 8 + 2 = 5 + 5 = 3 + 3 + 2 + 2. Répondre à T questions : pour N donné, afficher le plus petit nombre de termes d'une telle somme.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient un entier N.

## Sortie
T lignes : pour chaque question, le plus petit nombre de termes.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ N ≤ 10¹⁸

## Indices
1. Essayer le glouton : prendre le plus grand nombre de Fibonacci au plus égal à N, puis recommencer avec le reste. Il y a moins de 90 nombres de Fibonacci jusqu'à 10¹⁸.
2. Pour justifier le glouton, transformer une solution optimale : deux termes consécutifs F_k + F_{k+1} peuvent être remplacés par F_{k+2} (un terme de moins), et deux termes égaux 2 F_k par F_{k+1} + F_{k−2}.
3. Une somme de nombres de Fibonacci distincts, deux à deux non consécutifs, dont le plus grand est F_m, est strictement inférieure à F_{m+1}.

## Solution
**Le glouton.** On calcule les nombres de Fibonacci jusqu'à 10¹⁸ (il y en a 86), puis on prend le plus grand qui ne dépasse pas N, on le retire, et on recommence jusqu'à 0. On compte les termes.

**Une solution optimale « propre ».** Notons F₁ = 1, F₂ = 2, F₃ = 3, … Parmi les solutions optimales, prenons-en une dont la somme des **carrés** des termes est la plus grande. Elle ne contient pas deux termes consécutifs F_k et F_{k+1} : on les remplacerait par F_{k+2}, avec un terme de moins. Elle ne contient pas deux fois le même terme : 1 + 1 = 2 ferait gagner un terme ; 2 + 2 = 3 + 1 garde le même nombre de termes mais augmente la somme des carrés (de 8 à 10) ; et pour k ≥ 3, 2 F_k = F_k + F_{k−1} + F_{k−2} = F_{k+1} + F_{k−2}, avec F_{k+1}² + F_{k−2}² − 2 F_k² = F_{k−1} × (F_{k+1} − F_{k−2}) > 0. Dans tous les cas, on contredit le choix de la solution.

**Elle coïncide avec le glouton.** Une somme de termes distincts et non consécutifs dont le plus grand est F_m vaut au plus F_m + F_{m−2} + F_{m−4} + …, et cette somme est strictement inférieure à F_{m+1} (récurrence : F_m + (quelque chose < F_{m−1}) < F_m + F_{m−1} = F_{m+1}). Donc le plus grand terme de notre solution optimale vérifie F_m ≤ N < F_{m+1} : c'est le choix du glouton. On retire ce terme ; le reste est une solution du même type pour N − F_m, et on recommence. Le glouton fait donc exactement le nombre minimal de termes.

**Coût.** Au plus 86 termes et 86 comparaisons par question. Calculer le meilleur nombre de termes pour tous les montants jusqu'à N serait impossible pour N = 10¹⁸.
