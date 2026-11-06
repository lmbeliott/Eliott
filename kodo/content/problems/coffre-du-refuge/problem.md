---
id: coffre-du-refuge
title: Le vieux coffre du refuge
chapter: n3-glouton
order: 4
tags: [glouton, chaînes]
samples: 2
---

## Énoncé
Dans le grenier du refuge des Aiguilles, Mia et Yanis découvrent un vieux coffre. Sur le couvercle, une longue suite de N chiffres est gravée, avec ce message : « Efface exactement K chiffres. Ceux qui restent, lus dans l'ordre, forment le plus petit nombre possible : c'est le code. »

On ne peut pas changer l'ordre des chiffres : on choisit seulement lesquels effacer.

Écris un programme qui affiche le code.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient les N chiffres collés.

## Sortie
Les N − K chiffres restants, collés, qui forment le plus petit nombre possible.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ K < N
- Chaque chiffre est entre `1` et `9`.

## Indices
1. Tous les codes possibles ont N − K chiffres : le plus petit est celui qui a le plus petit premier chiffre, puis, à égalité, le plus petit deuxième chiffre, etc.
2. Si un chiffre est suivi d'un chiffre plus petit, effacer le premier rend le nombre plus petit. Lis les chiffres de gauche à droite en gardant ceux que tu conserves dans une pile.
3. Avant d'empiler un chiffre c, tant que tu peux encore effacer et que le sommet de la pile est plus grand que c, retire le sommet. À la fin, s'il reste des effacements, enlève les derniers chiffres de la pile.

## Solution
**L'idée gloutonne : rendre les premiers chiffres aussi petits que possible.** Les nombres comparés ont tous N − K chiffres : le plus petit est celui dont le premier chiffre est le plus petit, puis le deuxième, etc. On lit les chiffres de gauche à droite et on garde ceux qu'on conserve dans une pile. Avant d'empiler un chiffre c, tant qu'il reste des effacements et que le sommet de la pile est **strictement plus grand** que c, on efface ce sommet. À la fin, s'il reste des effacements, on retire les derniers chiffres : la pile est alors croissante (au sens large), donc ses derniers chiffres sont les plus grands.

**Pourquoi c'est optimal.** Commençons par décrire le meilleur code chiffre par chiffre.
- Le premier chiffre du code est forcément l'un des K + 1 premiers chiffres gravés, puisqu'il en faut encore N − K − 1 après lui. Le meilleur choix est le plus petit d'entre eux et, s'il apparaît plusieurs fois, sa **première** apparition : tout ce qu'on pourrait garder après une apparition plus lointaine peut aussi être gardé après la première. On efface tout ce qui est avant ce chiffre, puis on recommence avec la suite et les effacements restants.
- La pile fait exactement ces choix, sans rechercher de minimum à chaque fois. Quand le chiffre c arrive et que le sommet x de la pile est plus grand, tous les chiffres gravés entre x et c ont déjà été effacés : effacer x fait donc venir c à la place de x, avec le même début. Comme c < x, x n'était pas le bon choix pour cette place. Un chiffre n'est jamais effacé à cause d'un chiffre égal ou plus grand, ce qui garde la première apparition du minimum. Et quand il n'y a plus d'effacements, on est obligé de garder tous les chiffres suivants. Enfin, si des effacements restent à la fin, enlever les derniers chiffres de la pile (les plus grands) ne touche pas aux premières places.

On peut le vérifier sur le premier exemple (`4731592`, K = 3) : 7 est effacé à l'arrivée du 3, puis 4 aussi, puis 3 à l'arrivée du 1. Il reste `1592`.

**Complexité.** Chaque chiffre est empilé une fois et dépilé au plus une fois : O(N), même avec la boucle `while` dans la boucle `for`.

**Pourquoi la solution naïve est trop lente.** Répéter K fois « cherche depuis le début le premier chiffre plus grand que son voisin de droite, et efface-le » donne la bonne réponse, mais chaque recherche repart du début et chaque effacement décale toute la chaîne : O(N × K), soit des milliards d'opérations pour N = 100 000 et K = 50 000. Essayer toutes les façons d'effacer K chiffres est encore bien pire.

**Pièges.**
- Ne vide pas la pile si les chiffres sont égaux : effacer un chiffre égal au suivant ne fait rien gagner, et peut gaspiller un effacement utile plus loin.
- Si les chiffres sont déjà croissants (`123456`), la boucle `while` n'efface rien : ce sont les K derniers chiffres qu'il faut enlever.
