---
id: escalier-du-belvedere
title: L'escalier du belvédère
chapter: n4-dynamique
order: 1
tags: [programmation-dynamique]
samples: 2
---

## Énoncé
Pour rejoindre le belvédère de Valcorde, Lina gravit un long escalier taillé dans la roche. Les marches sont numérotées de `1` à `N` ; Lina part du sol (la marche `0`) et doit finir exactement sur la marche `N`. À chaque pas, elle peut sauter un nombre de marches pris dans une liste fixée de `K` longueurs. Ce matin, certaines marches sont verglacées : Lina ne doit **jamais** poser le pied dessus.

Deux montées sont différentes si leurs suites de sauts sont différentes (monter de `1` puis de `2` n'est pas pareil que monter de `2` puis de `1`). Écris un programme qui compte le nombre de montées possibles. Comme ce nombre peut être énorme, affiche son reste dans la division par `1 000 000 007`.

## Entrée
- La première ligne contient deux entiers `N` et `K`.
- La deuxième ligne contient `K` entiers distincts : les longueurs de saut autorisées.
- La troisième ligne contient une chaîne de `N` caractères : le `i`-ème caractère vaut `#` si la marche `i` est verglacée, `.` sinon.

## Sortie
Un seul entier : le nombre de montées possibles, modulo `1 000 000 007`.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ 10
- chaque longueur de saut est comprise entre `1` et `N`

## Indices
1. Énumérer toutes les montées est impossible : avec des sauts de `1` et `2`, il y en a déjà plus de 10²⁰ pour `N = 100`.
2. Note `nb[i]` le nombre de façons d'arriver sur la marche `i`. Par où Lina est-elle passée juste avant d'arriver en `i` ?
3. `nb[0] = 1`, `nb[i] = 0` si la marche `i` est verglacée, et sinon `nb[i]` est la somme des `nb[i - s]` pour chaque saut `s ≤ i`. Calcule les `nb[i]` dans l'ordre croissant, en prenant le modulo à chaque étape.

## Solution
On classe les montées qui arrivent sur la marche `i` selon leur **dernier saut**. Si ce dernier saut a la longueur `s`, la montée est une montée jusqu'à la marche `i - s`, suivie du saut `s`. Les montées des différentes classes sont toutes différentes, donc :

- `nb[0] = 1` (la montée vide : Lina est au sol) ;
- `nb[i] = 0` si la marche `i` est verglacée ;
- sinon `nb[i] = somme des nb[i - s]` pour les sauts `s ≤ i`.

Chaque `nb[i]` n'utilise que des valeurs d'indices plus petits : on les calcule de `1` à `N` dans l'ordre, et la réponse est `nb[N]`. Complexité : **O(N × K)**, soit au plus 10⁶ additions.

La solution naïve explore récursivement toutes les suites de sauts. Elle recalcule sans cesse les mêmes sous-problèmes : sans verglas, le nombre d'appels est au moins égal au nombre de montées, qui croît exponentiellement avec `N`. C'est tout l'intérêt de la programmation dynamique : chaque sous-problème `nb[i]` n'est calculé qu'une fois.

Pièges :
- Prends le modulo à chaque étape. En C++, une somme de `K` valeurs inférieures à 10⁹ + 7 dépasse 2³¹ : utilise des `long long`. En Python, les entiers ne débordent pas, mais des nombres de milliers de chiffres rendent le calcul très lent.
- Une marche verglacée vaut `0` même si l'on pourrait l'atteindre ; si la marche `N` est verglacée, la réponse est `0`.
- Un saut plus long que `i` ne peut pas mener à la marche `i` : attention aux indices négatifs (en Python, `nb[-1]` ne provoque pas d'erreur, il lit le dernier élément !).
