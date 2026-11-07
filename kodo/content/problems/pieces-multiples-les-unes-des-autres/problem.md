---
id: pieces-multiples-les-unes-des-autres
title: Pièces multiples les unes des autres
chapter: p4-gloutons
order: 1
tags: [glouton, mathématiques, arithmétique]
samples: 1
---

## Énoncé
Un pays utilise K sortes de pièces, de valeurs c₁ = 1 < c₂ < … < c_K, et chaque valeur **divise la suivante** : par exemple 1, 5, 10, 50, 100, ou 1, 2, 4, 8, 16. On dispose d'autant de pièces de chaque sorte qu'on veut.

Répondre à Q questions : pour un montant S, afficher le plus petit nombre de pièces dont la somme des valeurs vaut exactement S.

## Entrée
La première ligne contient K. La deuxième ligne contient les K valeurs c₁, …, c_K. La troisième ligne contient Q, et chacune des Q lignes suivantes contient un montant S.

## Sortie
Q lignes : pour chaque montant, le plus petit nombre de pièces.

## Contraintes
- 1 ≤ K ≤ 60
- c₁ = 1, c_K ≤ 10¹⁸, et c_i divise c_{i+1}
- 1 ≤ Q ≤ 1 000
- 0 ≤ S ≤ 10¹⁸

## Indices
1. L'algorithme glouton prend autant de pièces que possible de la plus grande valeur, puis continue avec le reste. Pour S = 10¹⁸, il ne faut pas retirer les pièces une par une : une division donne leur nombre d'un coup.
2. Pourquoi le glouton est-il optimal ici ? Dans une solution optimale, combien de pièces de valeur c_i (i < K) peut-il y avoir au plus ?
3. Si une solution contient au moins c_{i+1} / c_i pièces de valeur c_i, on peut les remplacer par une seule pièce de valeur c_{i+1}.

## Solution
**Le glouton.** On parcourt les valeurs de la plus grande à la plus petite ; pour la valeur c, on prend ⌊S / c⌋ pièces et on remplace S par S mod c. Avec c₁ = 1, le reste finit à 0. Il faut une division, pas une boucle qui retire les pièces une par une : avec la seule pièce de 1, cela ferait 10¹⁸ tours.

**Pourquoi c'est optimal.** Prenons une solution optimale, avec x_i pièces de valeur c_i. Pour i < K, on a x_i < c_{i+1} / c_i : sinon, on remplacerait c_{i+1} / c_i pièces de valeur c_i (de total c_{i+1}) par une seule pièce de valeur c_{i+1}, et comme c_{i+1} / c_i ≥ 2, on gagnerait au moins une pièce. Alors les pièces de valeur inférieure à c_j valent en tout au plus (c₂ − c₁) + (c₃ − c₂) + … + (c_j − c_{j−1}) = c_j − 1 < c_j, puisque x_i × c_i ≤ (c_{i+1} / c_i − 1) × c_i = c_{i+1} − c_i. Avec j = K : S = x_K × c_K + (reste < c_K), donc x_K = ⌊S / c_K⌋, exactement le choix du glouton. On recommence avec le reste et les valeurs plus petites : la solution optimale **est** celle du glouton.

**Coût.** K divisions par question. Une méthode qui calculerait le meilleur nombre de pièces pour chaque montant de 0 à S serait impossible pour S = 10¹⁸.
