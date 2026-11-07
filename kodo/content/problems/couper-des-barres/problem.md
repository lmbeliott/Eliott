---
id: couper-des-barres
title: Couper des barres
chapter: p4-dichotomie
order: 4
tags: [dichotomie]
samples: 2
---

## Énoncé
On dispose de N barres de métal ; la barre numéro i mesure Lᵢ centimètres. On peut faire au plus K coupes. Une coupe partage un morceau en deux morceaux dont les longueurs sont des nombres **entiers** de centimètres, strictement positifs.

Afficher la plus petite longueur possible du plus long morceau obtenu.

Par exemple, avec des barres de 7 et 5 centimètres et K = 2, on peut couper la première en 3 + 4 et la seconde en 2 + 3 : le plus long morceau mesure 4. On ne peut pas faire mieux.

## Entrée
La première ligne contient N et K. La deuxième ligne contient les N longueurs L₁, …, L_N.

## Sortie
La plus petite longueur possible du plus long morceau.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ K ≤ 10⁹
- 1 ≤ Lᵢ ≤ 10⁹

## Indices
1. Renverser la question : pour une longueur X donnée, combien de coupes faut-il au minimum pour que tous les morceaux mesurent au plus X ?
2. Une barre de longueur L doit être coupée en au moins ⌈L / X⌉ morceaux, donc ⌈L / X⌉ − 1 coupes, et ce nombre suffit.
3. Si X est possible, toute longueur plus grande l'est aussi : on cherche le plus petit X possible par dichotomie.

## Solution
**Le test pour une longueur X.** Une barre de longueur L découpée en morceaux d'au plus X centimètres a au moins ⌈L / X⌉ morceaux, puisque leur total vaut L. Il faut donc au moins ⌈L / X⌉ − 1 coupes, et ce nombre suffit : on découpe des morceaux de X centimètres tant que le reste dépasse X. En entiers, ⌈L / X⌉ s'écrit (L + X − 1) // X. La longueur X est **possible** si la somme de ces nombres de coupes, sur toutes les barres, est au plus K.

**Monotonie et dichotomie.** Si X est possible, X + 1 l'est aussi, car chaque ⌈L / X⌉ ne peut que diminuer quand X augmente. On cherche donc le plus petit X possible, avec l'invariant « lo n'est pas possible, hi est possible ». La longueur max(Lᵢ) est possible sans aucune coupe : on part de hi = max(Lᵢ) et lo = 0 (une longueur nulle n'est jamais possible). À la fin, hi est la réponse.

**Coût.** La dichotomie fait une trentaine d'étapes, et chaque test parcourt les N barres : environ 30 × N opérations. Essayer toutes les longueurs X une par une coûterait jusqu'à 10⁹ × N opérations. En C++, la somme des coupes peut atteindre 10¹³ : on la garde dans un `long long`, ou on s'arrête dès qu'elle dépasse K.
