---
id: pire-cas-du-tri-fusion
title: Pire cas du tri fusion
chapter: p4-diviser-regner
order: 2
tags: [récursivité, mathématiques]
samples: 1
---

## Énoncé
Le tri fusion trie une liste de n éléments ainsi : si n ≥ 2, il coupe la liste en une première partie de ⌊n/2⌋ éléments et une seconde de ⌈n/2⌉ éléments, trie chaque partie de la même façon, puis les fusionne. La fusion compare les premiers éléments restants des deux listes et place le plus petit ; dès qu'une liste est vide, il recopie l'autre sans comparaison. Fusionner deux listes de longueurs a et b demande donc au plus a + b − 1 comparaisons.

On note C(n) le plus grand nombre de comparaisons que fait le tri fusion sur une liste de n nombres distincts. On admet que les pires cas des deux moitiés et de la fusion peuvent être atteints en même temps, si bien que C(1) = 0 et, pour n ≥ 2 :

C(n) = C(⌊n/2⌋) + C(⌈n/2⌉) + n − 1

Par exemple, C(2) = 1, C(3) = 3 et C(4) = 5. Répondre à T questions : pour n donné, afficher C(n).

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient un entier n.

## Sortie
T lignes : pour chaque question, la valeur de C(n).

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ n ≤ 10¹⁷

## Indices
1. La traduction directe de la formule en fonction récursive est juste, mais elle fait environ 2n appels : beaucoup trop pour n = 10¹⁷.
2. Les deux nombres ⌊n/2⌋ et ⌈n/2⌉ diffèrent d'au plus 1. En descendant d'un niveau, ils ne donnent encore que deux valeurs consécutives : combien de valeurs différentes la récursion rencontre-t-elle en tout ?
3. Mémoriser les valeurs déjà calculées dans un dictionnaire, comme pour Fibonacci.

## Solution
**Peu de sous-problèmes différents.** Au niveau k de la récursion, tous les arguments valent ⌊n/2^k⌋ ou ⌊n/2^k⌋ + 1. En effet, c'est vrai au niveau 0, et si m vaut q ou q + 1, alors ⌊m/2⌋ et ⌈m/2⌉ valent ⌊q/2⌋ ou ⌊q/2⌋ + 1 (on le vérifie selon la parité de q). Il y a environ log₂ n ≈ 57 niveaux, donc au plus 2 × 57 valeurs différentes, alors que l'arbre des appels a environ 2n nœuds : les mêmes valeurs sont recalculées un nombre gigantesque de fois.

**Mémoïsation.** On garde un dictionnaire des valeurs déjà calculées, et la fonction le consulte avant de calculer. Chaque valeur n'est calculée qu'une fois : une centaine d'appels par question, et une profondeur de récursion d'environ 57, sans danger.

**Pour aller plus loin.** On peut montrer par récurrence la formule C(n) = n × k − 2^k + 1, où k = ⌈log₂ n⌉ est le plus petit entier tel que 2^k ≥ n. Elle donne un très bon test de la solution. En C++, C(n) atteint 5,6 × 10¹⁸ pour n = 10¹⁷ : un `long long` suffit, de justesse.
