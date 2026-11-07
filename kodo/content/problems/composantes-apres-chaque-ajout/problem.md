---
id: composantes-apres-chaque-ajout
title: Composantes après chaque ajout
chapter: p4-union-find
order: 1
tags: [graphes, union-find]
samples: 2
---

## Énoncé
Un graphe a `N` sommets et aucune arête au départ. On ajoute `M` arêtes, l'une après l'autre. Après chaque ajout, afficher le nombre de composantes connexes du graphe et le nombre de sommets de la plus grande composante.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : l'arête ajoutée relie `A` et `B` (on peut avoir `A = B`, et une arête peut être ajoutée plusieurs fois).

## Sortie
`M` lignes : après le `i`-ème ajout, le nombre de composantes et la taille de la plus grande, séparés par une espace.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Recompter les composantes par un parcours après chaque ajout coûte `M × (N + M)` opérations : 10⁹ ici.
2. Une arête entre deux sommets d'une même composante ne change rien. Sinon, elle fusionne deux composantes : le nombre de composantes baisse de 1.
3. Union-Find avec union par taille : la taille de la nouvelle composante est la somme des deux tailles, et la plus grande taille ne peut qu'augmenter.

## Solution
On maintient les composantes avec une structure **Union-Find** : `parent` (chaque sommet pointe vers un autre sommet de sa composante, la racine pointe vers elle-même) et `taille` (le nombre de sommets, à jour pour les racines). Au départ, chaque sommet est seul : `N` composantes, la plus grande de taille 1.

Pour chaque arête `A – B`, on cherche les racines `a` et `b`. Si `a = b`, les deux sommets étaient déjà dans la même composante : rien ne change. Sinon, on accroche la racine de la plus petite composante sous celle de la plus grande (**union par taille**), on additionne les tailles, le nombre de composantes diminue de 1, et la plus grande taille devient `max(plus grande, nouvelle taille)` : une fusion ne fait que grossir une composante, donc ce maximum ne diminue jamais.

**Pourquoi c'est juste.** Invariant : après chaque ajout, deux sommets ont la même racine exactement quand ils sont reliés par un chemin. Une nouvelle arête crée un chemin entre deux sommets seulement si elle relie leurs deux composantes, qu'elle fusionne : c'est ce que fait l'union.

**Complexité.** Avec l'union par taille et la compression des chemins, chaque opération coûte un temps quasi constant : O(N + M) en pratique. Un parcours complet après chaque ajout coûterait `M × (N + M)`, environ 10⁹ opérations.

**Pièges.** Une arête `A – A` ou une arête répétée ne change rien. Sans l'union par taille, les ajouts `1 – 2`, `2 – 3`, `3 – 4`… peuvent former une chaîne de 10 000 sommets : les recherches deviennent lentes, et une recherche récursive dépasse en Python la profondeur de récursion autorisée. D'où l'union par taille, et une recherche écrite avec des boucles.
