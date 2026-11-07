---
id: nombres-abondants-dans-des-intervalles
title: Nombres abondants dans des intervalles
chapter: p3-complexite
order: 5
tags: [mathématiques, sommes-préfixes]
samples: 2
---

## Énoncé
Un entier m ≥ 1 est **abondant** si la somme de ses diviseurs strictement plus petits que lui dépasse m. Par exemple, 12 est abondant, car 1 + 2 + 3 + 4 + 6 = 16 > 12, mais 10 ne l'est pas : 1 + 2 + 5 = 8.

Répondre à Q questions : combien y a-t-il de nombres abondants entre L et R (inclus) ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient L et R.

## Sortie
Q lignes : la réponse à chaque question.

## Contraintes
- 1 ≤ Q ≤ 10 000
- 1 ≤ L ≤ R ≤ 100 000

## Indices
1. Calculer la somme des diviseurs d'un nombre en essayant les diviseurs jusqu'à sa racine carrée coûte environ 300 opérations pour un nombre proche de 100 000. Le refaire pour chaque nombre de chaque question est beaucoup trop lent.
2. Calculer une fois pour toutes la somme des diviseurs de **tous** les nombres jusqu'à 100 000 : pour chaque d, ajouter d à tous ses multiples 2d, 3d, 4d… Combien d'additions cela fait-il ?
3. Avec un tableau de sommes préfixes du nombre d'abondants, chaque question se résout en une soustraction.

## Solution
**Toutes les sommes de diviseurs d'un coup.** Soit N la plus grande valeur de R. On part d'un tableau `s` de N + 1 zéros. Pour chaque d de 1 à N/2, on ajoute d à `s[2d]`, `s[3d]`, `s[4d]`… jusqu'à N. Chaque nombre m reçoit exactement ses diviseurs d < m : à la fin, `s[m]` est la somme cherchée.

**Pourquoi c'est rapide.** Pour un d donné, on fait au plus N/d additions. Le total est au plus N/1 + N/2 + N/3 + … + N/N = N × (1 + 1/2 + … + 1/N). Cette **somme harmonique** vaut environ ln(N) + 0,58, soit 12 pour N = 10⁵ : environ 1,2 million d'additions, une complexité O(N log N). Essayer les diviseurs jusqu'à √m pour chaque m coûterait O(N√N), environ 2 × 10⁷ opérations.

**Répondre aux questions.** On calcule `c[m]`, le nombre d'abondants entre 1 et m : `c[m] = c[m − 1] + 1` si `s[m] > m`, et `c[m] = c[m − 1]` sinon. Le nombre d'abondants entre L et R vaut `c[R] − c[L − 1]` : une opération par question, au lieu d'un parcours de l'intervalle, qui coûterait jusqu'à 10⁴ × 10⁵ = 10⁹ opérations.

**Coût total.** O(N log N + Q). On remarque que tous les multiples d'un nombre abondant, ou d'un nombre parfait comme 6 (1 + 2 + 3 = 6), sont abondants : environ un quart des nombres jusqu'à 100 000 le sont.
