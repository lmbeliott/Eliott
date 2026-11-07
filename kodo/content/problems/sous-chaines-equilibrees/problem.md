---
id: sous-chaines-equilibrees
title: Sous-chaînes équilibrées
chapter: n3-complexite
order: 8
tags: [sommes-préfixes, dictionnaires, chaînes]
samples: 2
---

## Énoncé
On te donne une chaîne de N lettres, toutes choisies parmi les K premières lettres de l'alphabet (`a`, `b`, `c`…). Une sous-chaîne (une suite de lettres consécutives de la chaîne) est **équilibrée** si chacune des K lettres y apparaît le même nombre de fois. Par exemple, avec K = 3, `cab` et `abcbac` sont équilibrées, mais pas `abca` ni `ab` (le `c` n'y apparaît pas).

Écris un programme qui compte les sous-chaînes équilibrées. Deux sous-chaînes qui ont les mêmes lettres mais pas la même position dans la chaîne comptent deux fois.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient la chaîne de N lettres minuscules, toutes parmi les K premières lettres de l'alphabet.

## Sortie
Un seul entier : le nombre de sous-chaînes équilibrées.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ 26

## Indices
1. Tester toutes les sous-chaînes, c'est environ N² / 2 = 5 × 10⁹ cas pour N = 100 000 : beaucoup trop. Comme pour les sommes sur des intervalles, compte les lettres dans chaque **préfixe** : le nombre de `c` entre les positions i + 1 et j est (nombre de `c` dans les j premières lettres) − (nombre de `c` dans les i premières).
2. La sous-chaîne entre les préfixes i et j est équilibrée quand chaque lettre a gagné autant d'apparitions que le `a` entre i et j. Autrement dit, pour chaque lettre `c`, la différence (nombre de `c`) − (nombre de `a`) est la même dans le préfixe i et dans le préfixe j.
3. Associe à chaque préfixe la liste de ses K différences « nombre de la lettre − nombre de `a` ». Les sous-chaînes équilibrées correspondent exactement aux paires de préfixes qui ont la même liste : compte-les avec un dictionnaire, en utilisant la liste (un `tuple` en Python) comme clé.

## Solution
**Des préfixes aux paires.** Notons `cnt_c(i)` le nombre de lettres `c` parmi les i premières lettres de la chaîne (avec `cnt_c(0) = 0`). La sous-chaîne qui va de la position i + 1 à la position j contient `cnt_c(j) − cnt_c(i)` lettres `c`. Elle est équilibrée quand ce nombre est le même pour toutes les lettres, donc égal à celui des `a` :

`cnt_c(j) − cnt_c(i) = cnt_a(j) − cnt_a(i)`, c'est-à-dire `cnt_c(j) − cnt_a(j) = cnt_c(i) − cnt_a(i)`, pour chaque lettre `c`.

On associe donc à chaque préfixe sa **signature** : la liste des différences `cnt_c − cnt_a`, pour les K lettres. Une sous-chaîne est équilibrée si et seulement si les deux préfixes qui la délimitent ont la même signature.

**Compter les paires.** On parcourt la chaîne en mettant la signature à jour à chaque lettre : une lettre `c` autre que `a` augmente sa différence de 1, et un `a` diminue toutes les autres de 1. Un dictionnaire `vus` compte combien de préfixes précédents avaient chaque signature (au départ, le préfixe vide, dont la signature ne contient que des 0). Pour chaque nouveau préfixe, on ajoute `vus[signature]` à la réponse, puis on incrémente `vus[signature]`. C'est la même idée que pour compter les sous-tableaux de somme donnée, avec une liste de nombres à la place d'un seul nombre.

Sur le premier exemple (K = 2), la différence `cnt_b − cnt_a` des préfixes de `aabbab` vaut successivement 0, −1, −2, −1, 0, −1, 0. La valeur 0 apparaît 3 fois (3 paires), la valeur −1 aussi (3 paires) et −2 une seule fois : 6 sous-chaînes équilibrées, qui sont `ab`, `ba`, `ab`, `aabb`, `abba` et `aabbab`.

**Complexité.** Chaque lettre met à jour la signature et la cherche dans le dictionnaire en O(K) : O(N × K) en tout, quelques millions d'opérations.

**Pourquoi la solution naïve est trop lente.** Même en mettant les compteurs à jour quand la sous-chaîne s'allonge, parcourir toutes les sous-chaînes coûte N² / 2 = 5 × 10⁹ étapes pour N = 100 000.

**Pièges.**
- Ne pas oublier le préfixe vide : sans lui, les sous-chaînes qui commencent à la première lettre ne sont jamais comptées.
- En Python, une liste ne peut pas être une clé de dictionnaire : il faut la convertir en `tuple`. En C++, une `map<vector<int>, long long>` fonctionne.
- Avec K = 1, toutes les sous-chaînes sont équilibrées : il y en a N × (N + 1) / 2, plus de 5 × 10⁹. Il faut un `long long` en C++.
- Une lettre parmi les K qui n'apparaît jamais dans la chaîne rend toute sous-chaîne déséquilibrée : la réponse est alors 0, et la signature s'en charge toute seule.
