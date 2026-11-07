---
id: compresser-une-chaine
title: Compresser une chaîne
chapter: n2-chaines
order: 5
tags: [chaînes]
samples: 2
---

## Énoncé
Pour raccourcir un texte qui contient beaucoup de lettres répétées, on le compresse ainsi : chaque groupe de lettres identiques qui se suivent est remplacé par la lettre, suivie du nombre de fois où elle est répétée. Quand une lettre est seule, on écrit seulement la lettre, sans le nombre `1`.

Par exemple, `aaabcc` devient `a3bc2`, et `xyyyyyyyyyyyx` (avec douze `y`) devient `xy12x`.

Écris un programme qui affiche la chaîne compressée.

## Entrée
Une seule ligne : la chaîne à compresser, formée de lettres minuscules sans accents, sans espace.

## Sortie
Une seule ligne : la chaîne compressée.

## Contraintes
- La chaîne contient entre 1 et 1 000 lettres.

## Indices
1. Parcours la chaîne en repérant les **groupes** : une suite de lettres identiques qui se suivent. Un groupe se termine quand la lettre suivante est différente, ou quand on arrive au bout de la chaîne.
2. Une façon simple : une position `i` marque le début d'un groupe. Avance une deuxième position `j` tant que `s[j]` est égal à `s[i]` (sans dépasser la fin). Le groupe a alors `j - i` lettres, et le groupe suivant commence en `j`.
3. Pour ajouter un nombre à une chaîne, il faut d'abord le transformer en texte : `str(n)` en Python, `to_string(n)` en C++. N'oublie pas qu'un groupe peut compter 10 lettres ou plus : le nombre a alors plusieurs chiffres.

## Solution
On découpe la chaîne en groupes de lettres identiques. On garde une position `i`, le début du groupe en cours. Une seconde position `j` part de `i` et avance tant qu'elle reste dans la chaîne et que `s[j]` est la même lettre que `s[i]`. Quand elle s'arrête, le groupe va de `i` à `j - 1` et compte `j - i` lettres :
- on ajoute la lettre au résultat ;
- si le groupe compte au moins 2 lettres, on ajoute aussi ce nombre, transformé en texte ;
- le groupe suivant commence en `j` : on recommence avec `i = j`, jusqu'à la fin de la chaîne.

Les pièges :
- oublier le **dernier** groupe : avec une méthode qui écrit un groupe quand la lettre change, le dernier groupe n'est jamais suivi d'un changement, il faut l'écrire après la boucle. La méthode avec les deux positions évite ce souci ;
- écrire `1` pour les lettres seules : l'énoncé demande de ne rien écrire ;
- croire que le nombre n'a qu'un chiffre : douze `y` donnent `y12`, et 1 000 fois la même lettre donne quatre chiffres. En convertissant le nombre entier en texte, plutôt qu'en ajoutant un seul caractère chiffre, tous les cas sont traités.
