---
id: chiffres-romains
title: Chiffres romains
chapter: p2-chaines
order: 8
synthesis: true
tags: [chaînes, listes, conditions]
samples: 2
---

## Énoncé
Convertir des nombres entre l'écriture habituelle et les chiffres romains, dans les deux sens.

Les symboles romains valent `I` = 1, `V` = 5, `X` = 10, `L` = 50, `C` = 100, `D` = 500 et `M` = 1000. Un nombre s'écrit en notant ses milliers, puis ses centaines, ses dizaines et ses unités, et on additionne les valeurs des symboles. Six paires font exception : un symbole placé juste avant un symbole plus grand est **soustrait**, ce qui donne `IV` = 4, `IX` = 9, `XL` = 40, `XC` = 90, `CD` = 400 et `CM` = 900. Ainsi, 1994 s'écrit `MCMXCIV` (1000 + 900 + 90 + 4) et 2026 s'écrit `MMXXVI`.

## Entrée
La première ligne contient l'entier `Q`. Chacune des `Q` lignes suivantes contient soit un entier écrit avec des chiffres, soit un nombre écrit correctement en chiffres romains (en majuscules).

## Sortie
`Q` lignes : pour chaque ligne de l'entrée, dans l'ordre, le même nombre dans l'autre écriture.

## Contraintes
- 1 ≤ Q ≤ 1 000
- Tous les nombres sont compris entre 1 et 3 999.

## Indices
1. Pour savoir dans quel sens convertir, il suffit de regarder le premier caractère de la ligne : un chiffre ou une lettre.
2. Des chiffres vers les romains : ranger dans deux tableaux les 13 valeurs `1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1` et les symboles correspondants `M, CM, D, CD, …, IV, I`. Pour chaque valeur, de la plus grande à la plus petite, tant que le nombre est au moins égal à cette valeur, on écrit le symbole et on la retire.
3. Des romains vers les chiffres : on parcourt les symboles de gauche à droite. Si un symbole vaut moins que celui qui le suit, on soustrait sa valeur ; sinon, on l'ajoute.

## Solution
On lit chaque ligne comme une chaîne, et son premier caractère indique le sens de la conversion.

**Vers les chiffres romains.** On prépare deux tableaux de même longueur : les valeurs `1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1` et les symboles `M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I`. On parcourt ces 13 cases dans l'ordre : tant que le nombre restant est au moins égal à la valeur, on ajoute le symbole à la chaîne résultat et on retire la valeur. Par exemple, 1994 donne `M` (reste 994), `CM` (reste 94), `XC` (reste 4), puis `IV`. Mettre les paires soustractives dans les tableaux évite tout cas particulier.

**Vers les chiffres habituels.** Il faut la valeur de chaque lettre. Sans dictionnaire, un tableau de 26 cases indexé par le rang de la lettre (`ord(c) - ord("A")`) fait l'affaire : on y range 1 pour `I`, 5 pour `V`, et ainsi de suite. On parcourt ensuite la chaîne par indice : le symbole d'indice `i` est soustrait s'il est suivi d'un symbole plus grand (`i + 1` doit alors exister), et ajouté sinon. Pour `MCMXCIV` : +1000 −100 +1000 −10 +100 −1 +5 = 1994.

Les pièges : sortir de la chaîne en regardant `s[i + 1]` pour le dernier symbole, et oublier qu'un même symbole peut se répéter (`MMM`, `XXX`) : c'est le rôle de la boucle « tant que » dans la première conversion.
