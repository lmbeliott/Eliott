---
id: lettres-du-panneau
title: Les lettres en bois
chapter: n3-recursivite
order: 2
tags: [récursivité, chaînes]
samples: 2
---

## Énoncé
Pour la fête du village, Malik a reçu un sac de lettres en bois pour fabriquer un panneau. Avant de le décorer, il s'amuse à chercher tous les mots (même ceux qui ne veulent rien dire) qu'il peut former en utilisant **toutes** ses lettres, chacune exactement une fois.

Certaines lettres sont en plusieurs exemplaires. Échanger deux lettres identiques donne le même mot : chaque mot ne doit apparaître qu'une seule fois dans la liste.

Écris un programme qui affiche tous ces mots dans l'ordre alphabétique.

## Entrée
Une seule ligne contenant les lettres de Malik, collées, en majuscules.

## Sortie
- Sur la première ligne, le nombre de mots différents.
- Puis tous ces mots, un par ligne, dans l'ordre alphabétique.

## Contraintes
- Il y a entre 1 et 12 lettres, toutes entre `A` et `Z`.
- Il y a au plus 20 000 mots différents.

## Indices
1. Avec 12 lettres, il y a 12! ≈ 479 millions de façons de les ranger. Les générer toutes puis enlever les doublons est beaucoup trop lent : il faut éviter de fabriquer deux fois le même mot.
2. Construis le mot lettre par lettre avec une fonction récursive. Plutôt qu'une liste de lettres, garde le **nombre** de lettres disponibles de chaque sorte.
3. À chaque position, essaie chaque lettre **différente** encore disponible une seule fois, dans l'ordre alphabétique. Les mots sortent alors sans doublon et déjà triés.

## Solution
**L'idée : énumérer les lettres distinctes, pas les exemplaires.** On compte les exemplaires de chaque lettre (`compte['N'] = 2` pour `ANNA`). La fonction récursive `explorer` ajoute une lettre à la fin du mot en construction : pour chaque lettre distincte c, dans l'ordre alphabétique, si `compte[c] > 0`, on la prend (`compte[c] -= 1`), on explore la suite, puis on la remet (`compte[c] += 1`). Quand le mot a toutes ses lettres, on l'ajoute à la liste.

**Pourquoi il n'y a pas de doublons.** Deux mots produits par deux branches différentes diffèrent à la première position où les branches se séparent, car on y a placé deux lettres **différentes**. Avec les deux `N` de `ANNA`, choisir « le premier N » ou « le second N » serait la même branche : on ne l'essaie qu'une fois.

**Pourquoi l'ordre est alphabétique.** À chaque position, les lettres sont essayées de `A` à `Z` : tous les mots dont la première lettre est plus petite sortent avant les autres, et ainsi de suite à chaque position.

**Complexité.** Chaque appel de la fonction correspond à un début de mot différent, qui mène à au moins un mot de la liste. Un mot de 12 lettres a 13 débuts (de 0 à 12 lettres) : il y a donc au plus 13 × 20 000 = 260 000 appels, avec au plus 12 lettres distinctes à essayer dans chacun.

**Pourquoi la solution naïve est trop lente.** Générer toutes les permutations (par exemple avec `itertools.permutations`), puis les mettre dans un ensemble et trier, fabrique 12! ≈ 4,8 × 10⁸ permutations pour `AAAAAABBBBCC`, alors qu'il n'y a que 13 860 mots différents.

**Pièges.**
- Remets toujours la lettre dans le stock après l'appel récursif : sinon les branches suivantes manquent de lettres.
- Affiche le nombre de mots en premier.
