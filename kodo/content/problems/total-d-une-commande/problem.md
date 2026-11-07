---
id: total-d-une-commande
title: Total d'une commande
chapter: p2-dictionnaires
order: 5
tags: [dictionnaires]
samples: 2
---

## Énoncé
Un catalogue donne le prix de chaque article. Une commande est une liste de lignes « article, quantité ». Calculer le prix total de la commande, et compter les lignes dont l'article ne figure pas dans le catalogue (elles sont ignorées dans le total).

Le catalogue peut citer plusieurs fois le même article : c'est alors le **dernier** prix donné qui est valable.

## Entrée
- La première ligne contient l'entier `N`, le nombre de lignes du catalogue.
- Les `N` lignes suivantes contiennent chacune un nom d'article et son prix (un entier), séparés par une espace.
- La ligne suivante contient l'entier `M`, le nombre de lignes de la commande.
- Les `M` lignes suivantes contiennent chacune un nom d'article et une quantité (un entier), séparés par une espace.

Les noms sont formés de lettres minuscules sans accent.

## Sortie
Deux lignes : le prix total de la commande, puis le nombre de lignes de la commande dont l'article est inconnu.

## Contraintes
- 1 ≤ N, M ≤ 1 000
- 1 ≤ prix ≤ 10 000
- 1 ≤ quantité ≤ 1 000

## Indices
1. Ranger le catalogue dans un dictionnaire : le nom de l'article est la clé, son prix la valeur.
2. Une affectation `prix[nom] = p` sur une clé déjà présente remplace l'ancienne valeur : c'est exactement la règle du dernier prix.
3. Avant de lire `prix[nom]`, tester `nom in prix`, sinon Python s'arrête avec une erreur `KeyError`. En C++, le total peut dépasser 2 × 10⁹ : utiliser `long long`.

## Solution
On lit le catalogue dans un **dictionnaire** `prix` qui associe à chaque nom son prix. L'affectation `prix[nom] = p` ajoute la clé si elle est nouvelle et **remplace** la valeur si la clé existe déjà : après la lecture, chaque article a donc son dernier prix.

On lit ensuite la commande ligne par ligne. Si le nom est une clé du dictionnaire (`nom in prix`), on ajoute `prix[nom] × quantité` au total ; sinon, on augmente le compteur d'articles inconnus.

Deux pièges. En Python, lire `prix[nom]` pour un nom absent provoque `KeyError` : il faut tester avant. En C++, c'est plus sournois : `prix[nom]` sur un nom absent ne provoque pas d'erreur, mais **crée** la clé avec la valeur 0 ; on teste donc avec `prix.count(nom)`. Enfin, le total peut atteindre 1 000 × 10 000 × 1 000 = 10¹⁰ : en C++, il faut un `long long`.
