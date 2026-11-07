---
id: jetons-de-trois-couleurs
title: Jetons de trois couleurs
chapter: p3-correction
order: 6
tags: [mathématiques]
samples: 2
---

## Énoncé
Un sac contient `R` jetons rouges, `V` verts et `B` bleus. Une **opération** consiste à prendre deux jetons de couleurs différentes et à les remplacer par deux jetons de la troisième couleur. Par exemple, un rouge et un vert deviennent deux bleus.

Afficher le plus petit nombre d'opérations qui rend tous les jetons de la même couleur, ou `-1` si c'est impossible. Si tous les jetons ont déjà la même couleur, la réponse est 0.

Chaque test contient `T` questions.

## Entrée
- La première ligne contient `T`.
- Les `T` lignes suivantes contiennent chacune trois entiers `R`, `V` et `B`.

## Sortie
Pour chaque question, une ligne avec le nombre minimal d'opérations, ou `-1`.

## Contraintes
- 1 ≤ T ≤ 5 000
- 0 ≤ R, V, B ≤ 10⁹
- R + V + B ≥ 1

## Indices
1. Une opération change les trois nombres de `−1`, `−1` et `+2`, dans un certain ordre. Que devient la différence entre deux de ces nombres, modulo 3 ?
2. Pour finir avec des jetons tous bleus, il faut faire disparaître les rouges et les verts. Combien d'opérations faut-il au moins, sachant qu'une opération retire au plus un jeton rouge ?
3. Si `R ≡ V (mod 3)`, on peut rendre tous les jetons bleus en exactement `max(R, V)` opérations. On essaie les trois couleurs d'arrivée.

## Solution
**Un invariant.** Une opération ajoute `−1`, `−1` et `+2` aux trois nombres, dans un certain ordre. La différence entre deux d'entre eux change donc de 0, de `+3` ou de `−3` : **modulo 3, les différences ne changent pas**. Pour finir avec des jetons tous bleus, il faut `R = V = 0` à la fin, donc `R ≡ V (mod 3)` dès le départ. C'est une condition nécessaire, et de même pour les deux autres couleurs.

**Une borne inférieure.** Une opération diminue chaque nombre d'au plus 1. Pour faire disparaître `R` rouges et `V` verts, il faut donc au moins `max(R, V)` opérations.

**Cette borne est atteinte** quand `R ≡ V (mod 3)`. Supposons `R ≤ V` (l'autre cas est symétrique). Si `R = B = 0`, tous les jetons sont déjà verts et la réponse est 0 : ce cas est couvert par le couple (rouge, bleu). Sinon, tant que `R < V`, on remplace un vert et un bleu par deux rouges si `B ≥ 1` (l'écart `V − R` diminue de 3), et sinon un rouge et un vert par deux bleus (possible car `R ≥ 1` ; l'écart ne change pas, mais `B` passe à 2). Comme `V − R` est un multiple de 3, l'écart finit par s'annuler ; il reste alors à faire `R` fois l'opération rouge + vert → bleus. Chaque opération retire exactement un vert, et l'on s'arrête quand il n'y en a plus : on a fait exactement `V = max(R, V)` opérations.

La réponse est donc le plus petit `max(x, y)` parmi les trois couples de couleurs `(x, y)` tels que `x ≡ y (mod 3)`, et `-1` si aucun couple ne convient. Par exemple, `(1, 4, 0)` donne 4 (couple rouge-vert), et `(2, 1, 0)` donne `-1`, car les trois restes 2, 1 et 0 sont différents.

**Coût.** Quelques opérations par question. Simuler ou explorer toutes les suites d'opérations serait hors de portée avec des nombres jusqu'à 10⁹.
