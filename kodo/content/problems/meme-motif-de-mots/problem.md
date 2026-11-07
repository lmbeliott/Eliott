---
id: meme-motif-de-mots
title: Même motif de mots
chapter: p2-synthese
order: 5
tags: [dictionnaires, chaînes, fonctions]
samples: 3
---

## Énoncé
Un motif est un mot de lettres, comme `abba`. Une phrase **suit** le motif si l'on peut associer un mot à chaque lettre de façon que :
- la phrase a autant de mots que le motif a de lettres, et le `i`-ième mot est celui associé à la `i`-ième lettre ;
- deux lettres différentes sont associées à deux mots différents.

Par exemple, `chat chien chien chat` suit le motif `abba` (`a` → `chat`, `b` → `chien`), mais `chat chat` ne suit pas le motif `ab`, car `a` et `b` seraient associés au même mot.

Dire si la phrase suit le motif.

## Entrée
La première ligne contient le motif, en lettres minuscules. La deuxième ligne contient la phrase : des mots de lettres minuscules séparés par une espace.

## Sortie
`OUI` si la phrase suit le motif, `NON` sinon.

## Contraintes
- Le motif a entre 1 et 1 000 lettres.
- La phrase a entre 1 et 1 000 mots, chacun de 1 à 10 lettres.

## Indices
1. Un dictionnaire `lettre → mot` permet de vérifier qu'une même lettre correspond toujours au même mot.
2. Ce n'est pas suffisant : avec le motif `ab` et la phrase `chat chat`, le dictionnaire `a → chat, b → chat` ne détecte aucune contradiction. Il faut aussi un dictionnaire `mot → lettre`.
3. Penser au cas où le nombre de mots diffère du nombre de lettres.

## Solution
On écrit une fonction `meme_motif(motif, mots)` qui renvoie un booléen. Elle commence par comparer les longueurs : si la phrase n'a pas autant de mots que le motif a de lettres, la réponse est `NON`.

Ensuite, on parcourt les positions `i` en tenant **deux dictionnaires** :
- `mot_de` associe à chaque lettre déjà rencontrée le mot qui lui correspond ;
- `lettre_de` associe à chaque mot déjà rencontré la lettre qui lui correspond.

Pour la lettre `c` et le mot `m` en position `i`, si `c` est déjà associée à un autre mot que `m`, ou si `m` est déjà associé à une autre lettre que `c`, la phrase ne suit pas le motif. Sinon, on enregistre les deux associations et on continue. Si la boucle se termine sans contradiction, les associations forment une correspondance entre lettres et mots qui respecte les deux règles.

Le piège est de n'utiliser que le premier dictionnaire : il garantit qu'une lettre a un seul mot, mais pas que deux lettres ont des mots différents. La fonction permet de renvoyer `False` dès la première contradiction, sans drapeau.

En C++, on ne connaît pas à l'avance le nombre de mots : on lit la phrase entière avec `getline`, puis on la découpe en mots en parcourant ses caractères, chaque espace terminant le mot en cours.
