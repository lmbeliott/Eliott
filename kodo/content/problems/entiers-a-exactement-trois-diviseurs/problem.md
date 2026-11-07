---
id: entiers-a-exactement-trois-diviseurs
title: Entiers à exactement trois diviseurs
chapter: p4-arithmetique
order: 3
tags: [arithmétique, mathématiques, dichotomie]
samples: 1
---

## Énoncé
Certains entiers ont exactement trois diviseurs : par exemple 4 (diviseurs 1, 2 et 4) et 25 (diviseurs 1, 5 et 25), mais pas 6 ni 16.

Répondre à Q questions : combien y a-t-il d'entiers n tels que L ≤ n ≤ R qui ont exactement trois diviseurs ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient deux entiers L et R.

## Sortie
Q lignes : pour chaque question, le nombre d'entiers de [L, R] qui ont exactement trois diviseurs.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ L ≤ R ≤ 10¹²

## Indices
1. Avec la formule du nombre de diviseurs, (e₁ + 1) × … × (e_k + 1) = 3 : à quoi ressemble la décomposition d'un tel nombre ?
2. Ce sont exactement les carrés de nombres premiers. n = p² est dans [L, R] si et seulement si p est entre ⌈√L⌉ et ⌊√R⌋.
3. Un crible d'Ératosthène jusqu'à 10⁶, puis un tableau qui donne pour chaque x le nombre de premiers au plus x.

## Solution
**Trouver la propriété.** Si n = p₁^e₁ × … × p_k^e_k, son nombre de diviseurs est (e₁ + 1) × … × (e_k + 1). Ce produit vaut 3, qui est premier, si et seulement s'il n'y a qu'un facteur, égal à 3 : k = 1 et e₁ = 2. Les entiers à exactement trois diviseurs sont donc les carrés de nombres premiers, p², de diviseurs 1, p et p².

**Compter.** p² est dans [L, R] si et seulement si L ≤ p² ≤ R, c'est-à-dire p ≤ ⌊√R⌋ et p > ⌊√(L − 1)⌋. La réponse vaut π(⌊√R⌋) − π(⌊√(L − 1)⌋), où π(x) est le nombre de premiers au plus x. Les racines carrées entières se calculent sans nombres à virgule, par dichotomie (chapitre précédent) : un flottant peut se tromper d'une unité près de 10¹², et les tests contiennent des carrés de premiers aux bornes.

**Le crible.** Comme √R ≤ 10⁶, on calcule une fois les premiers jusqu'à 10⁶ avec le crible d'Ératosthène, puis π(x) pour tout x ≤ 10⁶ par sommes préfixes. Chaque question coûte alors deux racines entières et deux lectures de tableau.

**Coût.** O(M log log M) pour le crible, avec M = 10⁶, plus O(log R) par question. Tester chaque entier de [L, R] serait impossible.
