---
id: prefixes-qui-couvrent-un-mot
title: Préfixes qui couvrent un mot
chapter: n4-chaines-avancees
order: 6
tags: [chaînes]
samples: 2
---

## Énoncé
On donne un mot `S` de longueur `N`. Un préfixe `U` de `S` **couvre** `S` si chaque lettre de `S` appartient à au moins une occurrence de `U` dans `S`. Les occurrences peuvent se chevaucher ou se toucher.

Par exemple, `aba` couvre `abaababaaba` : ses occurrences commencent aux positions `1`, `4`, `6` et `9`, et elles recouvrent les lettres `1` à `3`, `4` à `6`, `6` à `8` et `9` à `11`. En revanche, `a` ne couvre pas ce mot, car aucune occurrence de `a` ne contient un `b`.

Écris un programme qui trouve toutes les longueurs `L` (de `1` à `N`) telles que le préfixe de longueur `L` couvre `S`.

## Entrée
Une seule ligne contenant le mot `S`, formé de lettres minuscules.

## Sortie
- Sur la première ligne, le nombre `K` de longueurs qui conviennent.
- Sur la deuxième ligne, ces `K` longueurs dans l'ordre croissant, séparées par des espaces.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. Le préfixe de longueur `L` couvre `S` si et seulement si deux occurrences consécutives sont séparées d'au plus `L` positions, et si la dernière se termine à la fin du mot. Avec la fonction Z, les occurrences du préfixe de longueur `L` sont les positions `i` où `z[i] ≥ L`.
2. Vérifier chaque longueur séparément coûte O(N) par longueur, soit O(N²) sur un mot comme `aaa…a`. Regarde plutôt ce qui change quand `L` augmente de `1` : des positions disparaissent, et aucune n'apparaît.
3. Ajoute une sentinelle à la position `N`, puis garde les positions encore présentes dans une liste doublement chaînée. Quand une position disparaît, ses deux voisines deviennent consécutives : le plus grand écart ne peut qu'augmenter. La longueur `L` convient quand ce plus grand écart vaut au plus `L`.

## Solution
Notons `z[i]` la longueur du plus long préfixe commun à `S` et à `S[i..]` (positions comptées à partir de `0`, avec `z[0] = N`). Le préfixe de longueur `L` commence en `i` si et seulement si `z[i] ≥ L`. Notons `O(L)` l'ensemble de ces positions.

**Le critère.** Les occurrences du préfixe de longueur `L` recouvrent `S` exactement quand :
- deux positions consécutives de `O(L)` sont séparées d'au plus `L` (sinon une lettre entre les deux n'est couverte par personne) ;
- la dernière position `p` de `O(L)` vérifie `p + L = N`.

Ajoutons à `O(L)` une sentinelle en position `N`. Comme `p + L ≤ N` pour toute occurrence, la seconde condition revient à dire que l'écart entre `p` et la sentinelle vaut au plus `L`. Le critère devient donc : **le plus grand écart entre deux éléments consécutifs de `O(L) ∪ {N}` est au plus `L`**. La position `0` est toujours dans `O(L)`.

**Faire grandir `L`.** Quand on passe de `L - 1` à `L`, on retire de l'ensemble les positions où `z[i] = L - 1`, et on n'ajoute rien. On range les positions dans une liste doublement chaînée. Retirer `i` relie son précédent `a` à son suivant `b`, et le nouvel écart `b - a` est plus grand que les deux anciens. Le plus grand écart ne fait donc qu'augmenter : un simple maximum courant suffit, sans structure de données. Chaque position est retirée au plus une fois. On range d'abord les positions selon la valeur de `z[i]`, pour savoir lesquelles retirer à chaque étape.

Complexité : **O(N)** pour la fonction Z, puis O(N) pour tous les retraits.

Pourquoi les idées simples échouent : tester chaque longueur en parcourant ses occurrences coûte O(N) par longueur. Se limiter aux **bords** de `S` (les longueurs `L` avec `z[N - L] = L`) ne suffit pas : `aaa…a` a `N` bords, et `aaa…abaaa…a` en a des dizaines de milliers qui échouent tous, chacun après un long parcours. Dans les deux cas, cela fait près d'un milliard d'opérations ou plus.

Pièges :
- N'oublie pas la condition sur la fin du mot : dans `abaa`, le préfixe `aba` n'apparaît qu'au début, et la dernière lettre n'est couverte par aucune occurrence. La sentinelle en `N` règle ce cas.
- `L = N` convient toujours : `K ≥ 1`.
- Les écarts se mesurent entre **débuts** d'occurrences : deux occurrences de longueur `L` qui commencent à `L` positions d'écart se touchent sans laisser de trou.
