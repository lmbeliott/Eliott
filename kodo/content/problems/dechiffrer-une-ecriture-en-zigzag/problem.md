---
id: dechiffrer-une-ecriture-en-zigzag
title: Déchiffrer une écriture en zigzag
chapter: p3-chaines-avancees
order: 6
tags: [chaînes, mathématiques]
samples: 2
---

## Énoncé
Pour chiffrer un message, on écrit ses lettres en zigzag sur `K` lignes : la première lettre sur la ligne 1, la deuxième sur la ligne 2, et ainsi de suite jusqu'à la ligne `K`, puis on remonte (ligne `K − 1`, …, ligne 1), puis on redescend, etc. Avec `K = 1`, toutes les lettres sont sur la ligne 1. Le message chiffré est formé de la ligne 1 lue de gauche à droite, suivie de la ligne 2, et ainsi de suite.

Par exemple, `programmation` avec `K = 3` s'écrit :

```text
p...r...a...n
.r.g.a.m.t.o.
..o...m...i..
```

et devient `pran` + `rgamto` + `omi`, soit `pranrgamtoomi`.

Le message chiffré et `K` sont donnés. Retrouver le message de départ.

## Entrée
- La première ligne contient l'entier `K`.
- La deuxième ligne contient le message chiffré.

## Sortie
Le message de départ.

## Contraintes
- 1 ≤ K ≤ 10⁹
- Le message contient entre 1 et 150 000 lettres minuscules.

## Indices
1. La ligne sur laquelle tombe la lettre d'indice `i` (à partir de 0) ne dépend que de `i` : le motif des lignes se répète toutes les `2K − 2` lettres.
2. En comptant combien de lettres tombent sur chaque ligne, on sait où commence chaque ligne dans le message chiffré.
3. Si `K` dépasse la longueur `N` du message, les lignes au-delà de la `N`-ième restent vides : on peut remplacer `K` par `N`.

## Solution
Soit `N` la longueur du message. Si `K > N`, la descente ne se termine jamais avant la fin du message : la lettre d'indice `i` va sur la ligne d'indice `i`, exactement comme avec `K = N`. On remplace donc `K` par `min(K, N)`, ce qui évite de créer un milliard de lignes.

**La ligne d'une lettre.** Si `K = 1`, toutes les lettres vont sur la ligne 0. Sinon, un aller-retour complet (descente puis remontée) contient `P = 2K − 2` lettres, et le motif se répète. Pour l'indice `i`, on calcule `r = i % P` : si `r < K`, la lettre est sur la ligne `r` (on descend) ; sinon, elle est sur la ligne `P − r` (on remonte). Avec `K = 3` et `P = 4`, les indices 0, 1, 2, 3, 4 donnent bien les lignes 0, 1, 2, 1, 0.

**Deux passages.** Le premier passage calcule, pour chaque ligne, le nombre de lettres qui y tombent. Le message chiffré est la ligne 0, puis la ligne 1, etc. : la ligne `r` y commence donc à l'indice `debut[r] = longueur[0] + … + longueur[r − 1]`. Le second passage reconstruit le message dans l'ordre : pour chaque indice `i`, on calcule sa ligne `r`, on prend la prochaine lettre non encore utilisée de cette ligne, `C[debut[r]]`, puis on avance `debut[r]` de 1. C'est juste, car à l'intérieur d'une ligne, les lettres sont rangées dans l'ordre de leurs indices : la `j`-ième lettre de la ligne `r` dans le message chiffré est bien la `j`-ième lettre du message qui tombe sur cette ligne.

Coût : deux passages de `N` étapes et un tableau de `min(K, N)` cases, donc un travail proportionnel à `N`. Construire la grille complète, `K` lignes de `N` cases, demanderait jusqu'à 150 000 × 150 000 cases. Le message est construit dans une liste recollée avec `join` à la fin.
