---
id: compter-les-b-d-un-mot-reecrit
title: Compter les b d'un mot réécrit
chapter: n3-recursivite
order: 5
tags: [récursivité, chaînes]
samples: 2
---

## Énoncé
On fabrique des mots avec les lettres `a` et `b`, à l'aide de deux règles : chaque `a` est remplacé par le mot U, et chaque `b` par le mot W.

À l'étape 0, le mot est `a`. Pour passer d'une étape à la suivante, on remplace **en même temps** chaque lettre du mot par le mot de sa règle. Par exemple, avec U = `ab` et W = `a`, on obtient `a`, puis `ab`, puis `aba`, puis `abaab`, puis `abaababa`…

Écris un programme qui répond à Q questions sur le mot obtenu à l'étape E : pour un entier K donné, combien y a-t-il de `b` parmi les K premières lettres de ce mot ?

## Entrée
- La première ligne contient deux entiers E et Q.
- La deuxième ligne contient le mot U, la troisième le mot W.
- Les Q lignes suivantes contiennent chacune un entier K.

## Sortie
Q lignes : pour chaque question, dans l'ordre, le nombre de `b` parmi les K premières lettres du mot de l'étape E.

## Contraintes
- 0 ≤ E ≤ 60
- U et W contiennent chacun entre 1 et 5 lettres, `a` ou `b`.
- 1 ≤ Q ≤ 1 000
- 1 ≤ K ≤ 10¹⁸, et K ne dépasse pas la longueur du mot de l'étape E.

## Indices
1. Le mot peut compter plus de 10¹⁸ lettres : impossible de le construire. Mais le mot de l'étape t, obtenu depuis `a`, est fait des morceaux obtenus en t − 1 étapes depuis chaque lettre de U, mis bout à bout.
2. Calcule d'abord, pour chaque étape t et chaque lettre c, la longueur et le nombre de `b` du mot obtenu en t étapes depuis la seule lettre c. Ces nombres se déduisent de ceux de l'étape t − 1.
3. Écris `compter(t, c, k)` : le nombre de `b` parmi les k premières lettres du mot obtenu depuis c en t étapes. Parcours les lettres de la règle de c : tant qu'un morceau entier tient dans les k lettres, ajoute son nombre de `b` et retire sa longueur ; le premier morceau qui dépasse, appelle `compter` dessus, à l'étape t − 1. Attention aux longueurs gigantesques : plafonne-les.

## Solution
**L'idée : découper le mot sans jamais l'écrire.** Notons `mot(t, c)` le mot obtenu en t étapes depuis la seule lettre c. Remplacer toutes les lettres en même temps, t fois de suite, revient à remplacer c par sa règle, puis à développer chaque lettre de la règle pendant t − 1 étapes. Donc `mot(t, c)` est la mise bout à bout des `mot(t − 1, d)`, pour chaque lettre d de la règle de c. Le mot de l'étape E est `mot(E, a)`.

**Les tailles d'abord.** On calcule `longueur[t][c]` et `nb_b[t][c]` pour t de 0 à E : à l'étape 0, le mot est la lettre c elle-même (longueur 1, et un `b` seulement si c = `b`) ; ensuite, chaque valeur est la somme des valeurs de l'étape t − 1 pour les lettres de la règle de c.

**Puis la descente récursive.** `compter(t, c, k)` parcourt les lettres d de la règle de c. Si le morceau `mot(t − 1, d)` tient en entier dans les k premières lettres, on ajoute `nb_b[t − 1][d]` et on retire sa longueur de k. Sinon, les k lettres restantes s'arrêtent au milieu de ce morceau : la réponse est ce qu'on a déjà compté plus `compter(t − 1, d, k)`. À l'étape 0, le mot n'a qu'une lettre, et on compte 1 si c'est un `b` (et que k ≥ 1).

Sur le premier exemple (U = `ab`, W = `a`, E = 4, K = 5) : `mot(4, a)` = `mot(3, a)` + `mot(3, b)`, et `mot(3, a)` = `abaab` a exactement 5 lettres, dont 2 `b`. La réponse est 2.

**Complexité.** Le précalcul coûte O(E × (|U| + |W|)). Chaque question descend d'une étape à chaque appel et parcourt au plus 5 lettres par étape : O(E × 5) par question, soit environ 300 000 opérations pour 1 000 questions.

**Pourquoi la solution naïve est trop lente.** Construire le mot lettre par lettre est impossible : sa longueur peut doubler (ou plus) à chaque étape, et dépasser 10¹⁸ lettres bien avant l'étape 60.

**Pièges.**
- Les longueurs peuvent devenir énormes (jusqu'à 5⁶⁰). En C++, elles débordent des `long long`. Comme K ≤ 10¹⁸, il suffit de remplacer toute longueur plus grande par un plafond, par exemple 10¹⁸ + 1 : un morceau plafonné ne tient jamais en entier dans les K lettres, donc on ne se sert jamais de sa valeur exacte. Fais de même pour les nombres de `b`.
- Avec un plafond de 10¹⁸ + 1 et des règles de 5 lettres, la somme avant plafonnement reste sous 6 × 10¹⁸ : elle tient dans un `long long`.
- Certaines règles ne font pas grandir le mot (par exemple U = `b` et W = `a`) : la descente fait quand même ses E étapes, sans souci.
