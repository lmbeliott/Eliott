---
id: bataille-a-deux-paquets
title: Bataille à deux paquets
chapter: p3-piles-files
order: 5
tags: [simulation]
samples: 2
---

## Énoncé
Deux joueurs ont chacun un paquet de `N` cartes, face cachée. Les `2N` cartes portent les numéros de `1` à `2N`, chacun une fois.

À chaque tour, chaque joueur retourne la carte du dessus de son paquet. Celui qui a la plus forte carte gagne le tour : il glisse sous son paquet d'abord **sa** carte, puis celle de l'adversaire. La partie s'arrête dès qu'un joueur n'a plus de carte, ou après 1 000 000 tours si cela n'est pas arrivé avant.

Afficher le nombre de tours joués, puis le nombre de cartes du premier joueur, puis celui du second, à la fin de la partie.

## Entrée
La première ligne contient `N`. La deuxième ligne contient les `N` cartes du premier joueur, la troisième celles du second, chacune de la carte du dessus à celle du dessous.

## Sortie
Trois entiers sur une ligne : le nombre de tours, puis les nombres de cartes des deux joueurs.

## Contraintes
- 1 ≤ N ≤ 10 000

## Indices
1. Chaque paquet se comporte comme une file : on prend les cartes au début, on les ajoute à la fin.
2. Avec 1 000 000 tours et 20 000 cartes en jeu, retirer le début d'une liste Python avec `pop(0)` est trop lent. Utiliser `collections.deque` (en C++, `queue` ou `deque`).

## Solution
Chaque paquet est une file : la carte du dessus est en tête, et une carte glissée sous le paquet est ajoutée en queue. On simule tour par tour : on retire la tête de chaque file, on compare, et le gagnant ajoute à la fin de sa file sa propre carte puis celle de l'autre. On s'arrête quand une file est vide ou quand le compteur de tours atteint 1 000 000.

Tout est déterminé par les règles : la simulation est juste dès que chaque paquet est bien représenté. À tout moment, la file d'un joueur contient ses cartes du dessus vers le dessous, et le nombre total de cartes reste `2N`.

**Coût.** Au plus 1 000 000 tours, chacun en quelques opérations de file. Avec une liste et `pop(0)`, chaque retrait décale toutes les cartes restantes : jusqu'à 20 000 décalages par tour, soit des milliards d'opérations. Le piège : oublier la limite de tours, car certaines parties ne se terminent jamais.
