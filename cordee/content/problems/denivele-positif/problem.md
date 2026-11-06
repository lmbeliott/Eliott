---
id: denivele-positif
title: Le dénivelé de la randonnée
chapter: n1-listes
order: 3
tags: [listes]
samples: 2
---

## Énoncé
Sofia prépare le grand tour de la vallée de Valcorde. Sur sa carte, elle a relevé l'altitude de `N` points du sentier, dans l'ordre du parcours. Entre deux points qui se suivent, le sentier monte, descend ou reste plat. Pour savoir si la randonnée sera fatigante, Sofia veut connaître son **dénivelé positif** : le nombre total de mètres à grimper.

Écris un programme qui calcule le dénivelé positif du sentier : la somme de toutes les montées entre deux points qui se suivent. Les descentes ne comptent pas : elles ne s'ajoutent pas au total, et elles ne s'en retirent pas non plus.

## Entrée
- La première ligne contient l'entier `N`, le nombre de points relevés.
- La deuxième ligne contient `N` entiers séparés par des espaces : les altitudes des points, en mètres, dans l'ordre du parcours.

## Sortie
Un seul entier : le dénivelé positif, en mètres.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque altitude est comprise entre 500 et 4 800.

## Indices
1. Entre le point `i - 1` et le point `i`, le sentier monte de `alt[i] - alt[i - 1]` mètres quand ce nombre est positif.
2. Le premier point n'a pas de point avant lui : fais varier `i` de `1` à `N - 1`.
3. Garde un total qui commence à `0`, et ajoute-lui la différence seulement quand elle est strictement positive.

## Solution
On range les altitudes dans une liste, puis on regarde chaque paire de points qui se suivent : le point `i - 1` et le point `i`, pour `i` allant de `1` à `N - 1`. Si `alt[i] > alt[i - 1]`, le sentier monte de `alt[i] - alt[i - 1]` mètres, et on ajoute cette montée au total. Sinon, on n'ajoute rien.

Par exemple, pour les altitudes 1 200, 1 500, 1 400, 1 700, 1 650 : on monte de 300, on descend de 100, on monte de 300, on descend de 50. Le dénivelé positif vaut 300 + 300 = 600.

Les pièges classiques :
- calculer seulement « dernière altitude moins première altitude » : cela donne 450 sur l'exemple, car les descentes ont été retirées ;
- faire commencer `i` à `0` : en C++, `alt[-1]` n'existe pas ; en Python, `alt[-1]` est le **dernier** élément de la liste, donc le programme ne plante pas, mais il compte une montée imaginaire entre le dernier point et le premier.
