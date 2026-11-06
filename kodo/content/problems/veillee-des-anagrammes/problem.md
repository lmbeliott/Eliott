---
id: veillee-des-anagrammes
title: La veillée des anagrammes
chapter: n2-trier-compter
order: 4
tags: [dictionnaires, tri, chaînes]
samples: 2
---

## Énoncé
Le soir, au refuge du Lac Noir, les randonneurs jouent aux anagrammes. Awa écrit une liste de mots au tableau. Deux mots sont **cousins** si l'on peut obtenir l'un en changeant l'ordre des lettres de l'autre : ils utilisent exactement les mêmes lettres, chacune le même nombre de fois. Par exemple, `chien` et `niche` sont cousins, tout comme `arme`, `mare` et `rame`. En revanche, `tomme` et `motte` ne le sont pas : le premier a deux `m` et un `t`, le second un `m` et deux `t`.

Une **famille** est un groupe de mots tous cousins entre eux. Un mot qui n'a aucun cousin dans la liste forme une famille à lui tout seul.

Écris un programme qui range les mots d'Awa en familles.

## Entrée
- La première ligne contient un entier `N` : le nombre de mots.
- Les `N` lignes suivantes contiennent chacune un mot, en lettres minuscules sans accents. Les `N` mots sont tous différents.

## Sortie
- Sur la première ligne, le nombre de familles.
- Puis une ligne par famille : les mots de la famille, rangés dans l'ordre alphabétique et séparés par une espace.

Les familles sont affichées dans l'ordre alphabétique de leur premier mot.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque mot contient entre 1 et 20 lettres.

## Indices
1. Comparer chaque mot avec tous les autres est compliqué. Cherche plutôt une « étiquette » que l'on peut calculer pour chaque mot tout seul, et qui soit la même pour deux mots cousins, et différente sinon.
2. Que se passe-t-il si tu ranges les lettres de `chien` dans l'ordre alphabétique ? Et celles de `niche` ?
3. L'étiquette d'un mot, ce sont ses lettres triées : `"".join(sorted(mot))` en Python, ou une copie du mot triée avec `sort` en C++. Range ensuite les mots dans un dictionnaire dont les clés sont les étiquettes et les valeurs des listes de mots. Il reste à trier chaque famille, puis la liste des familles.

## Solution
L'idée clé est de donner à chaque mot une **signature** : ses lettres rangées dans l'ordre alphabétique. `chien` et `niche` ont tous deux la signature `cehin`. Deux mots sont cousins exactement quand ils ont la même signature : avoir les mêmes lettres, chacune le même nombre de fois, c'est avoir la même liste de lettres une fois triée. Pour `tomme` (`emmot`) et `motte` (`emott`), les signatures diffèrent.

Ensuite, c'est un **regroupement** : on utilise un dictionnaire qui associe à chaque signature la liste des mots qui la portent. Chaque mot est ajouté à la liste de sa signature, qu'on crée vide la première fois.

Pour l'affichage, on trie chaque famille, puis on trie la liste des familles. En Python comme en C++, deux listes se comparent élément par élément, en commençant par le premier : comme les mots sont tous différents, les familles se retrouvent rangées selon leur premier mot.

Les pièges :
- comparer seulement **l'ensemble** des lettres utilisées : `tomme` et `motte` utilisent les lettres `e`, `m`, `o`, `t`, mais pas le même nombre de fois. Trier les lettres conserve les répétitions, et règle donc le problème ;
- trier les familles avant d'avoir trié les mots à l'intérieur de chacune : l'ordre des familles dépend de leur premier mot **une fois triées** ;
- oublier d'afficher le nombre de familles sur la première ligne.

Comparer chaque mot à tous les autres marcherait aussi, mais serait plus long à écrire et plus lent : avec la signature, chaque mot n'est traité qu'une fois.
