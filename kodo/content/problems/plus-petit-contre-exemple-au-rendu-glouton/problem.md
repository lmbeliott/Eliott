---
id: plus-petit-contre-exemple-au-rendu-glouton
title: Plus petit contre-exemple au rendu glouton
chapter: p4-gloutons
order: 6
tags: [glouton, mathématiques]
samples: 2
---

## Énoncé
Un système de pièces est formé de K valeurs 1 = c₁ < c₂ < … < c_K, et on dispose d'autant de pièces de chaque valeur qu'on veut. Pour former un montant S, l'algorithme **glouton** prend la plus grande pièce qui ne dépasse pas ce qui reste à former, et recommence jusqu'à 0. Avec les pièces 1, 3 et 4, il forme 6 = 4 + 1 + 1 avec trois pièces, alors que 3 + 3 n'en utilise que deux.

Afficher le plus petit montant S pour lequel le glouton n'utilise **pas** le plus petit nombre de pièces possible, ou `0` si le glouton est optimal pour tous les montants.

On admet le résultat suivant : s'il existe un montant pour lequel le glouton n'est pas optimal, le plus petit de ces montants est strictement inférieur à c_{K−1} + c_K.

## Entrée
La première ligne contient K. La deuxième ligne contient les K valeurs c₁, …, c_K, dans l'ordre croissant.

## Sortie
Le plus petit montant pour lequel le glouton n'est pas optimal, ou `0`.

## Contraintes
- 1 ≤ K ≤ 15
- 1 = c₁ < c₂ < … < c_K ≤ 30 000

## Indices
1. Pour un montant s, le glouton prend la plus grande pièce c ≤ s, puis traite s − c de la même façon : son nombre de pièces vaut 1 + glouton(s − c). On le calcule pour tous les montants dans l'ordre croissant.
2. Le vrai minimum se calcule aussi dans l'ordre croissant : la dernière pièce ajoutée a une certaine valeur c ≤ s, et le reste s − c est formé au mieux. Donc opt(s) = 1 + min(opt(s − c)) sur les pièces c ≤ s.
3. Grâce au résultat admis, il suffit d'examiner les montants de 1 à c_{K−1} + c_K − 1.

## Solution
**Deux tableaux.** On calcule pour chaque montant s, de 1 à c_{K−1} + c_K − 1, deux nombres. Le nombre de pièces du glouton : g(s) = 1 + g(s − c), où c est la plus grande pièce au plus égale à s (le glouton prend c, puis continue sur s − c de la même façon). Le nombre minimal de pièces : opt(s) = 1 + min(opt(s − c)) sur toutes les pièces c ≤ s. Cette formule est juste par récurrence : une solution optimale pour s contient au moins une pièce c ; sans elle, il reste une solution pour s − c, qui utilise au moins opt(s − c) pièces ; et inversement, ajouter c à une solution optimale pour s − c donne une solution pour s. Comme c₁ = 1, tout montant est atteignable.

**La réponse.** Le premier s tel que g(s) > opt(s) est la réponse. Si aucun montant inférieur à c_{K−1} + c_K ne convient, le résultat admis garantit que le glouton est toujours optimal, et on affiche 0. Pour K ≤ 2, il n'y a d'ailleurs jamais de contre-exemple.

**Les leçons.** Les systèmes réels (1, 2, 5, 10, 20, 50…) sont optimaux pour le glouton, ce qui explique qu'on rende la monnaie ainsi. Mais un glouton n'est jamais juste « par évidence » : il suffit de trois pièces, comme 1, 3, 4, pour qu'il se trompe. C'est en comparant à un calcul exact sur de petits montants qu'on trouve le contre-exemple.

**Coût.** Au plus 60 000 montants, chacun en O(K) : environ 10⁶ opérations.
