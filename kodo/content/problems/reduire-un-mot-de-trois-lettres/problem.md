---
id: reduire-un-mot-de-trois-lettres
title: Réduire un mot de trois lettres
chapter: p3-correction
order: 8
synthesis: true
tags: [chaînes, mathématiques]
samples: 2
---

## Énoncé
Un mot est formé des lettres `a`, `b` et `c`. Une **réduction** remplace deux lettres voisines différentes par la troisième lettre : `ab` ou `ba` devient `c`, `ac` ou `ca` devient `b`, `bc` ou `cb` devient `a`. Le mot perd une lettre à chaque réduction. On fait autant de réductions qu'on le souhaite, dans l'ordre qu'on veut.

Par exemple, `aabb` peut devenir `acb`, puis `bb` ; ou `abab` peut devenir `cab`, puis `cc`.

Pour chaque mot, afficher la plus petite longueur qu'on peut atteindre. Quand cette longueur vaut 1, la lettre restante est toujours la même, quelles que soient les réductions choisies : l'afficher aussi, après une espace.

## Entrée
- La première ligne contient `T`, le nombre de mots.
- Les `T` lignes suivantes contiennent chacune un mot.

## Sortie
Pour chaque mot, une ligne : la plus petite longueur atteignable, suivie de la lettre restante si cette longueur vaut 1.

## Contraintes
- 1 ≤ T ≤ 5 000
- Chaque mot contient au moins une lettre, et la longueur totale des mots d'un test ne dépasse pas 100 000.

## Indices
1. Si le mot n'utilise qu'une seule lettre, aucune réduction n'est possible. Sinon, essayer de petits exemples à la main et regarder le nombre de `a`, de `b` et de `c`.
2. Une réduction change chacun des trois nombres de lettres de 1 (deux diminuent, un augmente). Que deviennent leurs parités ?
3. Si les trois nombres ont la même parité, cela reste vrai après chaque réduction ; or un mot d'une seule lettre a les nombres `1, 0, 0`. Il reste à montrer qu'on peut toujours descendre à 1 ou 2 lettres.

## Solution
On compte `na`, `nb` et `nc`, les nombres de `a`, de `b` et de `c`.

**Mot d'une seule lettre répétée.** Aucune réduction n'est possible : la réponse est la longueur du mot (suivie de la lettre si le mot a une seule lettre).

**Un invariant.** Une réduction diminue deux des nombres de 1 et augmente le troisième de 1 : les **trois parités changent** en même temps. Donc la propriété « `na`, `nb` et `nc` ont la même parité » est conservée, ainsi que l'identité de la lettre dont la parité diffère des deux autres, quand il y en a une. Un mot d'une seule lettre, par exemple `a`, a les nombres `1, 0, 0` : les parités ne sont pas toutes égales, et c'est `a` dont la parité diffère. Par conséquent, si les trois parités sont égales au départ, on ne peut jamais atteindre une seule lettre ; sinon, si l'on atteint une seule lettre, c'est forcément celle dont la parité diffère au départ.

**On peut toujours descendre à 2 lettres au plus.** Tant que le mot a au moins 4 lettres et au moins deux lettres différentes, il existe une réduction qui garde au moins deux lettres différentes. En effet, si une réduction donnait un mot formé uniquement de la lettre `z`, toutes les autres lettres seraient des `z`, et le mot serait de la forme `z…z x y z…z` ; en réduisant plutôt `y` avec un `z` voisin (ou `x` avec un `z` voisin), on obtient `x x` (ou `y y`) à côté d'au moins un `z` restant, puisqu'il y avait au moins deux `z`. On descend ainsi jusqu'à 3 lettres. À 3 lettres, ou bien une réduction garde deux lettres différentes, et une dernière réduction donne 1 lettre, ou bien toutes donnent un mot de 2 lettres identiques. Dans tous les cas, on atteint 1 ou 2 lettres.

**Conclusion.** Si les parités sont égales, 1 lettre est impossible et 2 est atteignable : la réponse est 2. Sinon, un mot de 2 lettres identiques (nombres `2, 0, 0`, parités égales) est impossible, donc la descente aboutit à 1 lettre : la réponse est 1, avec la lettre dont la parité diffère. Le programme ne fait que compter les lettres : un passage par mot, soit un coût proportionnel à la longueur totale. Essayer toutes les suites de réductions serait exponentiel.
