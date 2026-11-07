---
id: rendre-une-phrase-palindrome
title: Rendre une phrase palindrome
chapter: p3-chaines-avancees
order: 2
tags: [chaînes]
samples: 3
---

## Énoncé
Une phrase est un **palindrome** quand ses lettres, lues de droite à gauche, donnent la même suite que lues de gauche à droite, sans tenir compte des majuscules ni des caractères qui ne sont pas des lettres. Ainsi, `Esope reste ici et se repose.` est un palindrome.

Une phrase est donnée. Afficher le plus petit nombre de lettres qu'il faut remplacer (chacune par une autre lettre) pour qu'elle devienne un palindrome. Les autres caractères ne comptent pas et ne sont jamais modifiés.

## Entrée
Une ligne : la phrase.

## Sortie
Le nombre minimal de lettres à remplacer.

## Contraintes
- La phrase contient entre 1 et 150 000 caractères : lettres, chiffres, espaces et signes `.,;:!?'()-`. Elle ne commence ni ne finit par une espace et ne contient jamais deux espaces de suite.
- Une phrase sans aucune lettre est un palindrome.

## Indices
1. Commencer par extraire les lettres de la phrase, en minuscules, dans une liste.
2. La première lettre doit être égale à la dernière, la deuxième à l'avant-dernière, et ainsi de suite. Ces paires sont indépendantes les unes des autres.
3. Une paire de lettres différentes demande au moins un remplacement, et un seul suffit.

## Solution
On extrait les lettres de la phrase en minuscules, dans une liste `t` de longueur `n` (les chiffres et la ponctuation sont ignorés). La phrase est un palindrome exactement quand `t[i] == t[n − 1 − i]` pour tout `i`. Les positions se regroupent donc en paires `(i, n − 1 − i)` pour `i < n // 2`, plus la lettre du milieu quand `n` est impair, qui est seule dans son groupe.

Une paire de lettres différentes demande **au moins** un remplacement, puisque l'une des deux doit changer. Un remplacement **suffit** : on remplace la seconde par la première. Comme chaque lettre appartient à une seule paire, les remplacements d'une paire n'ont aucun effet sur les autres. La réponse est donc exactement le nombre de paires dont les deux lettres diffèrent.

On compte ces paires avec deux indices `i` et `j` qui partent des deux bouts et se rapprochent tant que `i < j`. Le programme fait un passage pour extraire les lettres et `n / 2` comparaisons : un travail proportionnel à la longueur de la phrase. Les pièges : oublier d'ignorer la casse (`E` et `e` sont la même lettre), ou compter une paire deux fois en allant jusqu'au bout de la liste au lieu de s'arrêter au milieu.
