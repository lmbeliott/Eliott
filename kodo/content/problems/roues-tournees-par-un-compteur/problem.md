---
id: roues-tournees-par-un-compteur
title: Roues tournées par un compteur
chapter: p3-complexite
order: 4
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
Un compteur mécanique affiche un nombre sur 18 roues, une par chiffre, avec des zéros à gauche. Pour passer de x à x + 1, la roue des unités tourne d'un cran ; chaque roue qui passe de 9 à 0 fait aussi tourner d'un cran la roue située à sa gauche. Par exemple, passer de 1 299 à 1 300 fait tourner 3 roues, et passer de 1 300 à 1 301 en fait tourner une seule.

Le compteur affiche A, et on l'avance un par un jusqu'à B. Répondre à Q questions de ce type : combien de crans les roues ont-elles tourné au total ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient A et B.

## Sortie
Q lignes : le nombre total de crans tournés pour chaque question.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 0 ≤ A ≤ B < 10¹⁸

## Indices
1. Simuler les B − A passages un par un est impossible quand B − A vaut 10¹⁷.
2. Compter roue par roue plutôt que passage par passage : combien de fois la roue des dizaines tourne-t-elle quand on va de A à B ? Elle tourne à chaque fois que le nouveau nombre est un multiple de 10.
3. Le nombre de multiples de d compris entre A + 1 et B vaut ⌊B/d⌋ − ⌊A/d⌋.

## Solution
**Changer de point de vue.** Au lieu de compter, pour chaque passage, les roues qui tournent, on compte, pour chaque roue, les passages où elle tourne. La roue numéro k (k = 0 pour les unités, 1 pour les dizaines…) tourne lors du passage de x à x + 1 exactement quand les k derniers chiffres de x valent tous 9, c'est-à-dire quand x + 1 est un multiple de 10^k. Le nombre x + 1 parcourt les entiers de A + 1 à B : la roue k tourne donc autant de fois qu'il y a de multiples de 10^k entre A + 1 et B, soit ⌊B/10^k⌋ − ⌊A/10^k⌋.

La réponse est la somme de ces quantités pour k = 0, 1, …, 17. Par exemple, de 1 299 à 1 301 : (1 301 − 1 299) + (130 − 129) + (13 − 12) + (1 − 1) = 2 + 1 + 1 = 4, et on retrouve bien 3 + 1.

**Coût.** 18 termes par question : O(log B) au lieu de O(B − A).

**Coût amorti.** Un passage peut faire tourner jusqu'à 18 roues, mais c'est rare : la roue k ne tourne qu'une fois tous les 10^k passages. Sur un long trajet, le nombre moyen de roues tournées par passage tend vers 1 + 1/10 + 1/100 + … = 10/9. C'est l'idée du **coût amorti** : une opération coûteuse de temps en temps, mais un coût total proche du nombre d'opérations. Les totaux dépassent 2³¹ : `long long` en C++.
