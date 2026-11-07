---
id: nombres-premiers-dans-une-fenetre
title: Nombres premiers dans une fenêtre
chapter: n3-arithmetique
order: 2
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
On s'intéresse aux nombres premiers compris entre L et R (bornes incluses). Rappel : un nombre premier est un entier supérieur ou égal à 2 dont les seuls diviseurs sont 1 et lui-même.

Écris un programme qui affiche combien il y a de nombres premiers entre L et R, puis le plus grand écart entre deux nombres premiers **consécutifs** de cet intervalle.

## Entrée
Une seule ligne avec deux entiers L et R.

## Sortie
Deux entiers séparés par une espace : le nombre de nombres premiers p tels que L ≤ p ≤ R, puis le plus grand écart q − p entre deux de ces nombres premiers qui se suivent. Si l'intervalle contient moins de deux nombres premiers, le second nombre est `0`.

## Contraintes
- 1 ≤ L ≤ R ≤ 10¹²
- R − L ≤ 1 000 000

## Indices
1. Le crible d'Ératosthène jusqu'à R est impossible : R peut valoir 10¹². Mais pour savoir si un nombre n ≤ R est premier, il suffit de connaître ses diviseurs premiers jusqu'à √R ≤ 10⁶.
2. Fais d'abord un crible ordinaire jusqu'à √R. Ensuite, crée un tableau de R − L + 1 cases, une par nombre de l'intervalle, et pour chaque nombre premier p ≤ √R, raye ses multiples dans l'intervalle.
3. Le premier multiple de p qui est au moins L est `⌈L / p⌉ × p`, c'est-à-dire `(L + p − 1) // p * p`. Commence à `max(p × p, ce multiple)` pour ne pas rayer p lui-même. N'oublie pas que 1 n'est pas premier.

## Solution
**L'idée : un crible sur une fenêtre.** Un nombre n ≥ 2 qui n'est pas premier a un diviseur premier p ≤ √n. Pour reconnaître les nombres premiers entre L et R, il suffit donc de rayer, dans cet intervalle, les multiples des nombres premiers jusqu'à √R ≤ 10⁶.

1. On fait un crible d'Ératosthène ordinaire jusqu'à √R, pour connaître ces petits nombres premiers.
2. On crée un tableau `fenetre` de R − L + 1 cases, toutes à « premier », où la case i représente le nombre L + i. Pour chaque nombre premier p ≤ √R, on raye les multiples de p dans la fenêtre, à partir de `max(p × p, ⌈L / p⌉ × p)` : les multiples plus petits que p × p ont un diviseur premier plus petit que p, et ils sont donc déjà rayés ; surtout, cela évite de rayer p lui-même quand il est dans la fenêtre.
3. Si L = 1, on raye la case de 1. Les cases restantes sont les nombres premiers de l'intervalle : on les parcourt dans l'ordre pour les compter et mesurer l'écart avec le précédent.

Sur le deuxième exemple (100 à 130), les nombres premiers sont 101, 103, 107, 109, 113 et 127 : il y en a 6, et le plus grand écart est 127 − 113 = 14.

**Complexité.** Le petit crible coûte O(√R log log √R). Dans la fenêtre, le nombre premier p raye environ (R − L) / p cases ; au total, c'est O((R − L) log log R + √R), quelques millions d'opérations.

**Pourquoi la solution naïve est trop lente.** Tester chaque nombre de la fenêtre en essayant tous les diviseurs jusqu'à sa racine coûte jusqu'à 10⁶ divisions par nombre premier trouvé, pour des dizaines de milliers de nombres premiers : plus de 10¹⁰ opérations. Et un crible ordinaire jusqu'à 10¹² demanderait un tableau de mille milliards de cases.

**Pièges.**
- En C++, les nombres dépassent 2³¹ : utilise des `long long` (y compris pour `p × p`).
- Ne raye pas p lui-même : c'est pour ça qu'on commence à `p × p` au plus tôt.
- 1 n'est pas premier, mais aucun nombre premier ne le raye : traite-le à part.
- Le petit crible doit aller jusqu'à √R inclus : si R = 49, il faut rayer les multiples de 7.
