---
id: sous-suites-d-une-chaine
title: Sous-suites d'une chaîne
chapter: n2-chaines
order: 4
tags: [chaînes, boucles]
samples: 2
---

## Énoncé
On te donne une chaîne `P` et une liste de mots. Un mot est une **sous-suite** de `P` si l'on peut choisir des lettres de `P`, **de gauche à droite**, qui forment exactement ce mot quand on les lit à la suite. On peut sauter autant de lettres de `P` qu'on veut, mais on ne revient jamais en arrière et on ne peut pas utiliser deux fois la même lettre de `P`.

Par exemple, si `P` vaut `programmes`, le mot `rame` est une sous-suite (le premier `r`, le `a`, un `m`, puis le `e`), mais pas `mare` : après les `m`, il n'y a plus de `a`.

Écris un programme qui dit, pour chaque mot, s'il est une sous-suite de `P`.

## Entrée
- La première ligne contient la chaîne `P`.
- La deuxième ligne contient un entier `Q` : le nombre de mots.
- Les `Q` lignes suivantes contiennent chacune un mot.

Toutes les lettres sont des minuscules sans accents.

## Sortie
`Q` lignes : pour chaque mot, dans l'ordre de l'entrée, `OUI` s'il est une sous-suite de `P`, `NON` sinon.

## Contraintes
- `P` contient entre 1 et 1 000 lettres.
- 1 ≤ Q ≤ 100
- Chaque mot contient entre 1 et 100 lettres.

## Indices
1. Fais-le à la main sur l'exemple : tu lis les lettres de `P` une par une, et tu gardes en tête la prochaine lettre du mot que tu cherches.
2. Si la lettre de `P` est celle que tu cherches, prends-la tout de suite ! Il n'y a jamais d'intérêt à attendre la même lettre plus loin dans `P` : prendre la première te laisse plus de lettres pour la suite du mot.
3. Garde un indice `j` : le nombre de lettres du mot déjà trouvées. Parcours `P` ; quand la lettre lue vaut `mot[j]`, augmente `j`. À la fin, le mot est une sous-suite si et seulement si `j` vaut la longueur du mot. N'oublie pas de vérifier `j < len(mot)` avant de lire `mot[j]`.

## Solution
On lit `P` une seule fois, de gauche à droite, en gardant un indice `j` sur la prochaine lettre du mot à trouver. À chaque lettre de `P`, si elle est égale à `mot[j]`, on la prend et on passe à la lettre suivante du mot (`j` augmente de 1). Sinon, on la saute. Le mot est une sous-suite si, à la fin, toutes ses lettres ont été trouvées, c'est-à-dire si `j` vaut la longueur du mot.

Pourquoi est-ce correct de prendre toujours **la première** lettre qui convient ? Si l'on peut former le mot en utilisant une lettre plus loin dans `P`, on peut aussi utiliser la première lettre identique située après la lettre choisie juste avant : elle est encore plus tôt dans `P`, donc toutes les lettres choisies ensuite restent bien après elle.

Les pièges :
- ne pas chercher chaque lettre du mot depuis le début de `P` : l'ordre compte (`mare` n'est pas une sous-suite de `programmes`), et une lettre de `P` ne sert qu'une fois (`aa` n'en est pas une non plus, car `programmes` n'a qu'un seul `a`) ;
- une fois toutes les lettres trouvées, il ne faut plus lire `mot[j]`, qui n'existe pas : c'est le rôle du test `j < len(mot)` ;
- un mot plus long que `P` n'est jamais une sous-suite, et la méthode le dit bien toute seule.
