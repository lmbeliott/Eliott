---
id: k-ieme-lettre-d-un-texte-compresse
title: K-ième lettre d'un texte compressé
chapter: p3-recursivite
order: 8
synthesis: true
tags: [récursivité, chaînes]
samples: 2
---

## Énoncé
Un texte est écrit sous forme compressée : `c(T)` signifie « le texte T répété c fois ». Les répétitions peuvent être imbriquées. Par exemple, `ab3(cd)e` se développe en `abcdcdcde`, et `2(x3(yz))w` en `xyzyzyzxyzyzyzw`.

Le texte développé peut être gigantesque. Répondre à Q questions : quelle est la K-ième lettre du texte développé ?

## Entrée
La première ligne contient le texte compressé S. La deuxième ligne contient Q. Chacune des Q lignes suivantes contient un entier K.

## Sortie
Q lignes : pour chaque question, la K-ième lettre du texte développé (la première lettre a le numéro 1).

## Contraintes
- 1 ≤ longueur de S ≤ 10 000
- S est formé de lettres minuscules, de chiffres et de parenthèses. Chaque nombre c est écrit sans zéro inutile, vérifie 1 ≤ c ≤ 10⁹, et est suivi d'un texte non vide entre parenthèses.
- Les parenthèses sont imbriquées sur au plus 1 000 niveaux.
- La longueur L du texte développé vérifie L ≤ 10¹⁸.
- 1 ≤ Q ≤ 50 et 1 ≤ K ≤ L

## Indices
1. Développer le texte est impossible : il peut compter 10¹⁸ lettres. Il faut seulement connaître la longueur développée de chaque morceau.
2. Lire S avec une fonction récursive : un texte est une suite de morceaux, chacun étant une lettre ou un groupe `c(T)`, et T se lit par un appel récursif. La fonction renvoie les morceaux, la longueur développée, et la position où la lecture s'est arrêtée.
3. Pour trouver la K-ième lettre, parcourir les morceaux en retirant leur longueur de K. Si K tombe dans un groupe `c(T)` dont T a la longueur ℓ, la lettre cherchée est la lettre numéro `(K − 1) mod ℓ + 1` de T.

## Solution
**Lecture.** La fonction `lire_texte(i)` lit un texte à partir de la position `i`, jusqu'à une `)` ou la fin de S. Tant qu'elle n'y est pas, elle lit un morceau : une lettre, de longueur 1, ou un nombre c suivi de `(` ; dans ce cas, un appel récursif lit le texte T du groupe et renvoie sa longueur ℓ, puis on saute la `)`. Le groupe a la longueur c × ℓ. On garde, pour chaque texte, la liste de ses morceaux et sa longueur. Chaque caractère de S est lu une seule fois : le coût est proportionnel à la longueur de S.

**Recherche.** La fonction `chercher(morceaux, k)` parcourt les morceaux dans l'ordre. Une lettre est la bonne si `k = 1` ; sinon, on retire 1 à k. Un groupe `c(T)` de longueur `c × ℓ` contient la lettre si `k ≤ c × ℓ` ; le texte développé du groupe est T répété, donc sa k-ième lettre est la lettre numéro `(k − 1) mod ℓ + 1` de T, cherchée par un appel récursif. Sinon, on retire `c × ℓ` à k et on passe au morceau suivant.

**Correction.** Par récurrence sur la profondeur d'imbrication : à chaque étape, k est la position de la lettre cherchée dans la partie du texte qui reste à parcourir, et la règle du modulo découle de la périodicité de T répété c fois.

**Coût.** Une question parcourt au plus une fois chaque morceau de S, soit au plus 10 000 étapes, et descend d'au plus 1 000 niveaux. En Python, cette profondeur dépasse la limite par défaut : `sys.setrecursionlimit(10000)` est nécessaire. En C++, les longueurs sont des `long long` ; `c × ℓ` ne déborde pas, car c'est la longueur d'une partie du texte, au plus 10¹⁸.
