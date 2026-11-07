---
id: motif-repete-sans-chevauchement
title: Motif répété sans chevauchement
chapter: n4-chaines-avancees
order: 2
tags: [chaînes, dichotomie, dictionnaires]
samples: 2
---

## Énoncé
On donne un mot `S` de longueur `N` et un entier `K`. Un mot `W` est **K-répété** dans `S` si on peut trouver `K` occurrences de `W` dans `S` qui ne se chevauchent pas deux à deux.

Écris un programme qui calcule la plus grande longueur `L` d'un mot K-répété dans `S`, puis la plus petite position où commence une occurrence d'un mot K-répété de longueur `L`. Les positions sont numérotées à partir de `1`.

## Entrée
- La première ligne contient l'entier `K`.
- La deuxième ligne contient le mot `S`, formé de lettres minuscules.

## Sortie
Deux entiers séparés par une espace : la longueur `L`, puis la position.

## Contraintes
- 1 ≤ N ≤ 50 000
- 1 ≤ K ≤ N
- Au moins une lettre apparaît `K` fois ou plus dans `S`.

## Indices
1. Si un mot de longueur `L` est K-répété, son préfixe de longueur `L - 1` l'est aussi, avec les mêmes positions de départ. Que peux-tu chercher par dichotomie ?
2. Pour une longueur `L` fixée, regroupe les fenêtres de longueur `L` égales grâce à un hachage polynomial calculé en O(1) par fenêtre. Pour un groupe, prendre les occurrences de gauche à droite, chacune dès qu'elle ne chevauche pas la précédente retenue, en donne le maximum.
3. Avec un module autour de 10⁹, des fenêtres différentes ont souvent le même hachage quand il y en a 50 000. Avec des calculs « modulo 2⁶⁴ » par débordement, certains mots construits exprès se confondent toujours. Prends un module premier de l'ordre de 2⁶¹, ou deux modules différents.

## Solution
**Dichotomie sur la longueur.** Si `W` de longueur `L` a `K` occurrences disjointes, son préfixe de longueur `L - 1` a des occurrences aux mêmes positions, encore plus courtes, donc toujours disjointes. La propriété « il existe un mot K-répété de longueur `L` » est donc vraie jusqu'à une certaine longueur, puis fausse. La longueur `1` convient (c'est garanti) et `L` ne dépasse pas `N / K`. Environ 16 tests suffisent.

**Tester une longueur.** On calcule les hachages des préfixes `h[i]` et les puissances `B^i`. La fenêtre `S[i..i+L-1]` a pour hachage `h[i+L] - h[i] × B^L` (modulo `M`), en O(1). On parcourt les positions dans l'ordre et, pour chaque hachage, on retient la dernière occurrence gardée et le nombre d'occurrences gardées. Une nouvelle occurrence en `i` est gardée si `i ≥ dernière + L`. Ce choix **glouton** est optimal : prendre l'occurrence la plus à gauche possible laisse toujours au moins autant de place pour les suivantes. Pour la position demandée, on garde la première occurrence de chaque hachage qui atteint `K`.

Total : **O(N log N)** opérations sur des hachages, avec un dictionnaire (ou un tri en C++).

**Les collisions.** Deux fenêtres différentes peuvent avoir le même hachage. Avec 50 000 fenêtres et un module `M ≈ 10⁹`, le « paradoxe des anniversaires » rend une collision probable à chaque test de longueur : les tests contiennent de tels cas. Les calculs modulo 2⁶⁴ par débordement des entiers ont un autre défaut. Le mot de Thue-Morse d'ordre 11 et son complémentaire (`a` et `b` échangés) ont toujours le même hachage, quelle que soit la base. Un test exploite cela. La solution utilise le module premier `2⁶¹ - 1` : la probabilité d'une collision devient négligeable. En C++, le produit de deux nombres de 61 bits se calcule avec `unsigned __int128`. Deux modules d'environ 10⁹, combinés, conviennent aussi.

Pourquoi les idées simples échouent : comparer directement les fenêtres (ou les mettre dans un dictionnaire de chaînes) coûte O(L) par fenêtre, soit O(N × L) par longueur testée. Les tests ont des réponses de plus de 10 000 lettres, ce qui fait des milliards d'opérations.

Pièges :
- Ce n'est pas le nombre d'occurrences qui compte, mais le nombre d'occurrences **disjointes** : dans `aaaaa`, le mot `aaa` apparaît 3 fois mais n'est pas 2-répété.
- Calcule `h[i+L] - h[i] × B^L` modulo `M` en évitant les résultats négatifs.
