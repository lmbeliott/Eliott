---
id: plus-long-plateau
title: Plus long plateau
chapter: p1-tant-que
order: 7
tags: [boucles, conditions]
samples: 2
---

## Énoncé
Un capteur envoie des mesures, une par ligne, et termine par `-1`. Un **plateau** est un groupe de mesures consécutives toutes égales ; sa longueur est son nombre de mesures. Par exemple, dans `4 4 7 7 7 2 7`, les plateaux sont `4 4`, `7 7 7`, `2` et `7`.

Afficher la longueur du plus long plateau, puis la valeur de ses mesures. Si plusieurs plateaux ont la longueur maximale, choisir celui qui arrive en premier.

## Entrée
Des entiers positifs ou nuls, un par ligne, suivis d'une ligne contenant `-1`.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : la longueur du plus long plateau, puis la valeur de ses mesures.

## Contraintes
- Entre 1 et 10 000 mesures avant le `-1`.
- Chaque mesure est comprise entre 0 et 10⁹.

## Indices
1. Pour savoir si une mesure prolonge le plateau en cours, il suffit de la comparer à la mesure **précédente**. Il faut donc garder la précédente dans une variable.
2. Une variable `longueur` donne la longueur du plateau en cours : elle augmente de 1 si la mesure est égale à la précédente, et repart à `1` sinon (la nouvelle mesure commence un nouveau plateau).
3. Après chaque mesure, comparer `longueur` au meilleur plateau trouvé. Utiliser `>` et non `>=` pour garder le premier en cas d'égalité.

## Solution
On lit la première mesure avant la boucle : elle forme un plateau de longueur 1, qui est aussi le meilleur pour l'instant. Puis on lit les mesures suivantes jusqu'à la sentinelle `-1`.

Pour chaque nouvelle mesure `x` :
- si `x` est égale à la mesure précédente, le plateau en cours s'allonge : `longueur = longueur + 1` ;
- sinon, un nouveau plateau commence : `longueur = 1`.

Ensuite, si `longueur` dépasse strictement la meilleure longueur connue, on retient cette longueur et la valeur `x`. Enfin, `x` devient la mesure précédente, et on lit la suivante.

Les pièges : remettre `longueur` à 0 au lieu de 1 quand un plateau commence (la nouvelle mesure compte déjà), ne mettre à jour le meilleur qu'au moment où un plateau se termine (on oublie alors le dernier plateau), et utiliser `>=`, qui garderait le dernier plateau de longueur maximale au lieu du premier.
