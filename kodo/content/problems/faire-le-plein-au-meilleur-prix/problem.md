---
id: faire-le-plein-au-meilleur-prix
title: Faire le plein au meilleur prix
chapter: n3-glouton
order: 8
tags: [glouton, simulation]
samples: 2
time_limit_ms: 500
---

## Énoncé
Une route va du kilomètre 0 au kilomètre L. Un véhicule consomme exactement 1 litre de carburant par kilomètre, et son réservoir contient au plus C litres. Il part du kilomètre 0 avec un réservoir vide.

Il y a N stations le long de la route : la station i est au kilomètre X_i et vend le litre P_i. La première station est au kilomètre 0. Dans chaque station où il passe, le véhicule peut acheter le nombre entier de litres qu'il veut, tant que le réservoir ne déborde pas.

Écris un programme qui calcule le coût minimal pour atteindre le kilomètre L.

## Entrée
- La première ligne contient trois entiers N, L et C.
- Les N lignes suivantes contiennent chacune deux entiers X_i et P_i, par position croissante.

## Sortie
Un seul entier : le coût total minimal, ou `-1` s'il est impossible d'atteindre le kilomètre L.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ L ≤ 10⁹ et 1 ≤ C ≤ 10⁹
- 0 = X_1 < X_2 < … < X_N < L
- 1 ≤ P_i ≤ 1 000

## Indices
1. Acheter juste de quoi atteindre la station suivante est faux, et faire le plein partout aussi : regarde le premier exemple. Ce qui compte, c'est le prix des litres que l'on brûle vraiment.
2. Imagine que tu fais le plein à chaque station, mais que tu ne paies un litre qu'au moment où tu le brûles. Si tu arrives à une station moins chère avec des litres plus chers encore dans le réservoir, tu aurais mieux fait de ne pas les acheter : jette-les (ils ne t'ont rien coûté), et remplace-les par ceux de la station.
3. Range le réservoir comme une file de lots (prix, litres), du moins cher au plus cher. À chaque station : retire à droite les lots plus chers que la station, complète le plein à droite au prix de la station, puis roule jusqu'à l'étape suivante en brûlant les litres de gauche, les moins chers, et en les payant.

## Solution
**Le cas impossible.** Si deux étapes voisines (une station et la suivante, ou la dernière station et l'arrivée) sont à plus de C kilomètres, aucun plein ne suffit : la réponse est `-1`. Sinon, faire le plein partout permet d'arriver, et il reste à payer le moins possible.

**L'idée : décider après coup.** On fait le plein à chaque station, mais « à crédit » : on ne paie un litre qu'au moment où on le brûle. Un litre jamais brûlé n'a jamais vraiment été acheté. Le réservoir est une file de lots (prix, litres) rangés du moins cher au plus cher. À chaque station :
- on retire de la fin de la file tous les lots plus chers que la station : il valait mieux ne pas les acheter et prendre ces litres ici ;
- on complète le réservoir jusqu'à C litres avec un lot au prix de la station, ajouté en fin de file (la file reste triée) ;
- on roule jusqu'à l'étape suivante : on brûle d'abord les litres les moins chers, en début de file, et on les paie.

Cela correspond à un vrai plan d'achat : chaque litre brûlé a été acheté à la station de son lot, et il était bien dans le réservoir, car le réservoir réel ne contient que les litres qui seront brûlés plus tard, qui sont dans la file. Et ce plan est le meilleur : chaque kilomètre est parcouru avec le litre le moins cher qui pouvait encore se trouver dans le réservoir à ce moment-là, sans jamais dépasser C litres. C'est le même schéma que la pile du cours : on revient sur les choix devenus mauvais dès qu'une meilleure option apparaît.

Sur le premier exemple (L = 10, C = 6) : au kilomètre 0, on prend 6 litres à 5. Au kilomètre 3, il en reste 3 à 5, plus chers que la station à 2 : on les jette et on remplit 6 litres à 2. Au kilomètre 5, il reste 4 litres à 2 ; on complète avec 2 litres à 4. Au kilomètre 8, il reste 1 litre à 2 et 2 litres à 4 : on jette ceux à 4 et on complète avec 5 litres à 3. Au total, on a brûlé 3 litres à 5, 6 à 2 et 1 à 3 : 15 + 12 + 3 = 30.

**Complexité.** Chaque station ajoute un lot, retiré au plus une fois. Chaque trajet entame au plus un lot sans le finir. Le tout est en O(N).

**Pourquoi les solutions simples ne marchent pas.** Acheter à chaque station juste de quoi atteindre la suivante coûte 37 sur le premier exemple. Faire le plein partout fait acheter des litres chers inutiles. Le glouton « si une station moins chère est à portée, acheter juste de quoi l'atteindre ; sinon faire le plein et aller à la moins chère à portée » est juste, mais chercher ces stations en parcourant toutes celles à portée coûte O(N²) quand les prix montent le long de la route : environ 5 × 10⁷ comparaisons, trop lent en Python.

**Pièges.**
- Les coûts dépassent 2³¹ (jusqu'à 10⁹ litres à 1 000) : utilise des `long long` en C++.
- N'oublie pas le dernier trajet, de la dernière station au kilomètre L.
- Retire seulement les lots **strictement** plus chers ; garder ceux au même prix ne change rien au coût.
