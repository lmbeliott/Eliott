---
id: atteindre-un-nombre
title: Atteindre un nombre
chapter: n1-boucles
order: 6
tags: [boucles, conditions]
samples: 3
---

## Énoncé
On part du nombre `A`. À chaque étape, on peut faire une seule des deux opérations suivantes :
- ajouter 1 ;
- multiplier par `K`.

Écris un programme qui affiche le plus petit nombre d'étapes nécessaires pour obtenir exactement le nombre `B`.

Par exemple, avec `A = 3`, `B = 25` et `K = 2`, il faut 4 étapes : 3 → 6 → 12 → 24 → 25.

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `K` séparés par des espaces.

## Sortie
Un seul entier : le plus petit nombre d'étapes pour passer de `A` à `B`.

## Contraintes
- 1 ≤ A ≤ B ≤ 1 000 000 000
- 2 ≤ K ≤ 10

## Indices
1. Partir de `A` oblige à faire des choix difficiles : faut-il multiplier tout de suite, ou ajouter 1 d'abord ? Essaie plutôt de partir de `B` et de remonter vers `A`, en défaisant les opérations une par une.
2. En remontant, si `B` n'est pas un multiple de `K`, la dernière opération ne peut pas être une multiplication par `K` : c'était forcément « ajouter 1 ». On revient donc à `B - 1`.
3. Si `B` est un multiple de `K` et que `B / K` est encore au moins égal à `A`, diviser par `K` est toujours le meilleur choix. Et quand `B / K` (division entière) est plus petit que `A`, on ne pourra plus jamais diviser : il ne reste que `B - A` fois « ajouter 1 », à compter d'un seul coup.

## Solution
On raisonne à l'envers : on part de `B` et on remonte jusqu'à `A`. Chaque opération se défait : « diviser par `K` » défait « multiplier par `K` », et « retirer 1 » défait « ajouter 1 ». En remontant, les nombres diminuent, et ils ne doivent jamais passer sous `A`. Tant que `B > A` :
- si `B // K < A`, plus aucune division n'est possible, ni maintenant ni plus tard : on ajoute `B - A` étapes d'un coup, et c'est fini ;
- sinon, si `B` est un multiple de `K`, on divise par `K` ;
- sinon, la dernière opération était forcément « ajouter 1 » : on retire 1.

Pourquoi est-ce le meilleur choix de diviser dès que c'est possible ? Supposons que `B` soit un multiple de `K`, et qu'on retire 1 au lieu de diviser. Pour diviser plus tard, il faudra retomber sur un multiple de `K`, donc retirer au moins `K` en tout, puis diviser : au moins `K + 1` étapes pour arriver à `B / K - 1`. En divisant d'abord puis en retirant 1, on arrive au même nombre en 2 étapes seulement. Et si l'on ne divise plus jamais, il faut `B - A` étapes, alors que diviser puis retirer 1 jusqu'à `A` en coûte `1 + B / K - A`, jamais plus.

Exemple : `A = 2`, `B = 100`, `K = 3`. En remontant : 100 → 99 (retirer 1) → 33 (diviser) → 11 (diviser) → 10 → 9 (retirer 1 deux fois) → 3 (diviser) → 2 (retirer 1). Cela fait 7 étapes, et le chemin dans le bon sens est 2 → 3 → 9 → 10 → 11 → 33 → 99 → 100.

Le piège : retirer 1 à chaque tour de boucle, même quand plus aucune division n'est possible. Pour `A = 500 000 001` et `B = 1 000 000 000`, la boucle ferait alors presque 500 millions de tours : beaucoup trop lent. En comptant les `B - A` étapes d'un seul coup, la boucle ne fait que quelques dizaines de tours.
