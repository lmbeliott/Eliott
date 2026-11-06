---
id: plus-longue-periode-dans-le-budget
title: Plus longue période dans le budget
chapter: n3-complexite
order: 2
tags: [deux-pointeurs]
samples: 2
---

## Énoncé
Le prix de location d'un vélo change tous les jours : le jour i, la location coûte P_i euros. Tu disposes de B euros et tu veux louer le vélo pendant des jours **consécutifs**, sans dépenser plus de B euros au total.

Écris un programme qui affiche le plus grand nombre de jours consécutifs dont le prix total ne dépasse pas B. La location peut commencer n'importe quel jour.

## Entrée
- La première ligne contient deux entiers N et B.
- La deuxième ligne contient N entiers P_1, P_2, …, P_N : le prix de chaque jour.

## Sortie
Un seul entier : le plus grand nombre de jours consécutifs dont le prix total ne dépasse pas B. Affiche `0` si même le jour le moins cher coûte plus que B.

## Contraintes
- 1 ≤ N ≤ 50 000
- 1 ≤ B ≤ 10⁹
- 1 ≤ P_i ≤ 100

## Indices
1. Essayer tous les jours de départ, et pour chacun avancer tant que le budget suffit, peut demander des centaines de millions d'opérations quand les périodes sont longues.
2. Garde une « fenêtre » de jours consécutifs, de `debut` à `fin`, et son prix total. Quand tu ajoutes un jour à droite et que la fenêtre devient trop chère, que faut-il faire ?
3. Les prix sont positifs : si la fenêtre `debut..fin` est trop chère, toute fenêtre qui commence au même jour et finit plus tard l'est aussi. Retire donc des jours à gauche (`debut += 1`) jusqu'à repasser sous le budget. Chaque indice n'avance que vers la droite.

## Solution
**L'idée : deux pointeurs (fenêtre glissante).** On fait avancer `fin` de 1 à N. À chaque étape, on ajoute le prix du jour `fin` au total de la fenêtre. Tant que ce total dépasse B, on retire le jour `debut` et on avance `debut`. La fenêtre `debut..fin` est alors la plus longue fenêtre abordable qui se termine au jour `fin` : on compare sa longueur `fin − debut + 1` au meilleur résultat.

Pourquoi a-t-on le droit de ne jamais reculer `debut` ? Parce que les prix sont tous positifs : si les jours `debut..fin` coûtent trop cher, alors les jours `debut..fin+1` coûtent encore plus cher. Une fenêtre trop chère ne redevient jamais abordable en s'allongeant à droite.

**Complexité.** `fin` avance N fois et `debut` avance au plus N fois en tout : O(N), même si la boucle `while` est à l'intérieur de la boucle `for`.

**Pourquoi la solution naïve est trop lente.** Essayer chaque jour de départ et avancer tant que le budget suffit coûte de l'ordre de N × L opérations, où L est la longueur de la réponse. Sur les grands tests, les périodes font des dizaines de milliers de jours : on dépasse le milliard d'opérations.

**Pièges.**
- Si un jour coûte à lui seul plus que B, la boucle `while` vide complètement la fenêtre (`debut` dépasse `fin`) : la longueur vaut alors 0, ce qui est correct.
- Cette méthode ne marche que parce que les prix sont positifs. Avec des nombres négatifs, il faudrait une autre idée.
