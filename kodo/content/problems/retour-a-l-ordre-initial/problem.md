---
id: retour-a-l-ordre-initial
title: Retour à l'ordre initial
chapter: p4-synthese
order: 2
tags: [graphes, arithmétique, mathématiques]
samples: 2
---

## Énoncé
Un paquet contient `N` cartes, en positions `1` à `N`. Un mélange déplace la carte de la position `i` vers la position `P_i` ; les `P_i` sont les entiers de `1` à `N`, chacun une fois. On répète le même mélange.

Afficher le plus petit nombre `k ≥ 1` de mélanges après lesquels toutes les cartes sont revenues à leur position de départ, modulo `1 000 000 007`.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient `P₁ … P_N`.

## Sortie
Un seul entier : ce nombre de mélanges, modulo `1 000 000 007`.

## Contraintes
- 1 ≤ N ≤ 20 000

## Indices
1. Suivre une carte : `i → P_i → P_(P_i) → …` finit par revenir en `i`. Les positions se découpent en **cycles**, comme les composantes d'un graphe où chaque sommet a exactement une flèche sortante.
2. Une carte d'un cycle de longueur `L` est à sa place exactement après un multiple de `L` mélanges. La réponse est le PPCM des longueurs des cycles.
3. Ce PPCM peut avoir des centaines de chiffres. Pour chaque nombre premier `q`, son exposant dans le PPCM est le plus grand exposant de `q` dans les longueurs : factoriser chaque longueur avec un crible.

## Solution
**Des cycles.** Le graphe `i → P_i` a exactement une flèche qui sort de chaque sommet et une qui y entre : il se découpe en cycles disjoints. On les parcourt avec un tableau `vu`, en suivant les flèches depuis chaque position pas encore vue : O(N) au total.

**Le PPCM.** Dans un cycle de longueur `L`, une carte avance d'un cran sur le cycle à chaque mélange : elle est à sa place exactement quand le nombre de mélanges est un multiple de `L`. Toutes les cartes sont à leur place quand `k` est un multiple de toutes les longueurs : le plus petit tel `k` est leur **PPCM**.

**Le calculer modulo 10⁹ + 7.** Le PPCM ne se réduit pas modulo un nombre au fil du calcul (le PGCD n'a plus de sens après réduction). On passe par les facteurs premiers : si `L = q₁^e₁ × q₂^e₂ × …`, le PPCM a pour exposant de chaque premier `q` le **maximum** des exposants de `q` dans les longueurs. Un crible donne le plus petit facteur premier de chaque entier jusqu'à `N`, ce qui factorise chaque longueur en quelques divisions. Il reste à multiplier les `q^e` modulo 10⁹ + 7.

**Complexité.** O(N log log N) pour le crible, O(N) pour les cycles, et chaque longueur se factorise en O(log N).

**Pièges.** Le PPCM réel peut dépasser 10¹⁵⁰ : en C++, calculer `ppcm = ppcm / pgcd × L` déborde, et prendre le reste au fil du calcul donne un résultat faux. (En Python, les entiers n'ont pas de taille limite : on peut aussi calculer le PPCM exact, puis son reste ; la méthode par les exposants fonctionne dans les deux langages.) Les points fixes (`P_i = i`) sont des cycles de longueur 1. Si la permutation est l'identité, la réponse est `1`.
