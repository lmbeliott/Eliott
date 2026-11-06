---
id: former-un-mot-plusieurs-fois
title: Former un mot plusieurs fois
chapter: n2-trier-compter
order: 2
tags: [listes, chaînes]
samples: 2
---

## Énoncé
Une boîte contient des lettres en plastique. On veut écrire le même mot le plus de fois possible avec ces lettres. Chaque lettre de la boîte ne peut servir qu'une seule fois, et un mot ne compte que s'il est écrit en entier.

Par exemple, pour écrire `pomme`, il faut un `p`, un `o`, **deux** `m` et un `e`.

Écris un programme qui affiche le nombre maximum de fois où l'on peut écrire le mot.

## Entrée
- La première ligne contient les lettres de la boîte, écrites à la suite, dans le désordre.
- La deuxième ligne contient le mot à écrire.

Toutes les lettres sont des minuscules sans accents.

## Sortie
Un seul entier : le nombre maximum d'exemplaires du mot que l'on peut écrire.

## Contraintes
- La boîte contient entre 1 et 1 000 lettres.
- Le mot contient entre 1 et 20 lettres.

## Indices
1. Commence par compter combien la boîte contient de `a`, de `b`, …, de `z`. Un tableau de 26 compteurs suffit : la case `ord(c) - ord("a")` (en C++ : `c - 'a'`) correspond à la lettre `c`.
2. Compte de la même façon les lettres du mot. Si le mot utilise 2 `m` et que la boîte en contient 5, les `m` permettent d'écrire le mot 5 // 2 = 2 fois.
3. Chaque lettre du mot donne une limite au nombre d'exemplaires : la réponse est la plus petite de ces limites.

## Solution
On remplit deux tableaux de 26 compteurs : `dans_boite[k]` et `dans_mot[k]` donnent le nombre de fois où la `k`-ième lettre de l'alphabet apparaît dans la boîte et dans le mot.

Pour chaque lettre présente dans le mot (`dans_mot[k] > 0`), on peut écrire au plus `dans_boite[k] // dans_mot[k]` exemplaires du mot : c'est le nombre de fois où l'on peut prélever toutes les lettres `k` nécessaires. La réponse est le minimum de ces valeurs. Pour calculer ce minimum, on part d'une valeur assez grande (la taille de la boîte, par exemple) et on la diminue lettre après lettre.

Les pièges :
- les lettres répétées dans le mot : dans le premier exemple, la boîte contient trois `p`, trois `o` et trois `e`, mais seulement cinq `m`, et chaque `pomme` en demande deux. On ne peut donc écrire le mot que 2 fois, et non 3 ;
- une lettre du mot absente de la boîte donne une limite de 0 : la réponse est alors 0 ;
- ne pas diviser par `dans_mot[k]` quand il vaut 0 : les lettres qui ne sont pas dans le mot ne limitent rien.

Un dictionnaire marcherait aussi pour compter, mais quand les valeurs possibles sont peu nombreuses et connues à l'avance (ici, 26 lettres), un simple tableau de compteurs est plus direct.
