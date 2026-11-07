---
id: plus-courte-racine-d-un-morceau
title: Plus courte racine d'un morceau
chapter: n4-chaines-avancees
order: 4
tags: [chaînes, mathématiques]
samples: 2
time_limit_ms: 500
---

## Énoncé
La **racine** d'un mot `W` est le plus court mot `U` tel que `W` s'écrit `U U … U` (`U` répété un nombre entier de fois). Par exemple, la racine de `abcabcabc` est `abc`, celle de `aaaa` est `a`, et celle de `abcab` est `abcab` lui-même.

On donne un mot `S` et `Q` requêtes. Chaque requête désigne un morceau `S[l..r]` (les lettres de la position `l` à la position `r` incluses, numérotées à partir de `1`).

Écris un programme qui affiche, pour chaque requête, la longueur de la racine du morceau.

## Entrée
- La première ligne contient le mot `S`, formé de lettres minuscules. On note `N` sa longueur.
- La deuxième ligne contient l'entier `Q`.
- Les `Q` lignes suivantes contiennent chacune deux entiers `l` et `r`.

## Sortie
`Q` lignes : pour chaque requête, dans l'ordre, la longueur de la racine de `S[l..r]`.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 10 000
- 1 ≤ l ≤ r ≤ N

## Indices
1. Si `L = r - l + 1`, la longueur de la racine est un diviseur `t` de `L`, et le morceau s'écrit avec un bloc de longueur `t` exactement quand il a la **période** `t` : `S[l..r-t]` est égal à `S[l+t..r]`. Avec un hachage polynomial, ce test coûte O(1).
2. Essayer tous les diviseurs de `L` coûte trop cher, car certaines longueurs en ont plus de 100. Si `t` convient et si `t'` est un diviseur de `L` multiple de `t`, alors `t'` convient aussi. Et la racine divise toutes les longueurs qui conviennent.
3. Pars de `t = L`. Pour chaque facteur premier `p` de `L`, divise `t` par `p` tant que `t / p` convient. Un crible qui donne le plus petit facteur premier de chaque entier jusqu'à `N` décompose `L` en quelques étapes.

## Solution
Notons `L = r - l + 1`. Un mot de longueur `L` s'écrit `U U … U` avec `|U| = t` si et seulement si `t` divise `L` et le mot a la période `t`, c'est-à-dire `S[l..r-t] = S[l+t..r]`. Avec les hachages des préfixes, cette égalité se teste en **O(1)**.

**Structure des longueurs valides.** Appelons `t` *valide* s'il divise `L` et si le morceau a la période `t`. Si `t` est valide, tout diviseur de `L` multiple de `t` l'est aussi. Réciproquement, si `t₁` et `t₂` sont valides, leur PGCD l'est aussi : c'est le lemme de Fine et Wilf, qui s'applique car `t₁ + t₂ ≤ L + pgcd(t₁, t₂)` quand les deux divisent `L`. La racine `t₀` est donc le plus petit élément valide, et les longueurs valides sont exactement les diviseurs de `L` multiples de `t₀`.

**Retirer les facteurs premiers.** On part de `t = L`, toujours valide. Pour chaque nombre premier `p` qui divise `L`, on remplace `t` par `t / p` tant que `t` reste divisible par `p` et que `t / p` est valide. Comme « valide » veut dire « multiple de `t₀` », on retire de `t` exactement les facteurs `p` en trop, et l'ordre des nombres premiers n'a pas d'importance. À la fin, `t = t₀`. Le nombre de tests est au plus le nombre de facteurs premiers de `L` comptés avec multiplicité, plus le nombre de nombres premiers distincts : moins de 25 pour `L ≤ 100 000`. Un crible du plus petit facteur premier décompose `L` aussi vite.

Total : **O(N log log N + Q log N)**.

Pourquoi les idées simples échouent : essayer chaque diviseur en comparant lettre à lettre coûte jusqu'à environ 128 × 100 000 opérations par requête (98 280 a 128 diviseurs). Les tests sont construits pour que chaque comparaison aille presque jusqu'au bout. Recalculer la fonction préfixe du morceau à chaque requête coûte O(L) par requête, soit plusieurs centaines de millions d'opérations au total : trop lent aussi.

Pièges :
- Ne compare pas des hachages calculés « modulo 2⁶⁴ » par débordement : sur le mot de Thue-Morse, la moitié gauche et la moitié droite d'un bloc aligné de longueur 4096 ont toujours le même hachage, et un test le vérifie. Utilise un grand module premier (`2⁶¹ - 1`) ou deux modules.
- Les nombres premiers à essayer sont ceux de `L`, pas ceux de `t` (qui changent pendant le calcul) : décompose `L` une fois au début.
