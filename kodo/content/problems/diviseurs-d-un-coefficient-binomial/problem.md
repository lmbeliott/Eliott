---
id: diviseurs-d-un-coefficient-binomial
title: Diviseurs d'un coefficient binomial
chapter: n3-arithmetique
order: 5
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Pour deux entiers 0 ≤ K ≤ N, le coefficient binomial C(N, K) est le nombre de façons de choisir K objets parmi N. Il vaut

C(N, K) = N! / (K! × (N − K)!)

où n! = 1 × 2 × … × n, et 0! = 1. Par exemple, C(6, 2) = 720 / (2 × 24) = 15.

Écris un programme qui calcule le nombre de diviseurs de C(N, K). Comme ce nombre peut être énorme, affiche son reste dans la division par 1 000 000 007.

## Entrée
Une seule ligne avec deux entiers N et K.

## Sortie
Un seul entier : le nombre de diviseurs de C(N, K), modulo 1 000 000 007.

## Contraintes
- 0 ≤ K ≤ N ≤ 1 000 000

## Indices
1. Si n = p₁^e₁ × p₂^e₂ × … est la décomposition de n en facteurs premiers, n a exactement (e₁ + 1) × (e₂ + 1) × … diviseurs : un diviseur choisit, pour chaque pᵢ, un exposant entre 0 et eᵢ. Il suffit donc de connaître l'exposant de chaque nombre premier dans C(N, K).
2. Les nombres premiers qui divisent C(N, K) sont au plus N : un crible jusqu'à N les donne tous. L'exposant de p dans C(N, K) est l'exposant de p dans N!, moins ceux dans K! et dans (N − K)!.
3. Dans n!, chaque multiple de p apporte un facteur p, chaque multiple de p² en apporte un de plus, et ainsi de suite : l'exposant de p dans n! vaut n // p + n // p² + n // p³ + …

## Solution
**Compter les diviseurs à partir des exposants.** Si n = p₁^e₁ × … × p_r^e_r, un diviseur de n s'écrit p₁^f₁ × … × p_r^f_r avec 0 ≤ fᵢ ≤ eᵢ, et chaque choix des exposants donne un diviseur différent : n a (e₁ + 1) × … × (e_r + 1) diviseurs. On n'a pas besoin de connaître C(N, K), seulement l'exposant de chaque nombre premier dans sa décomposition.

**L'exposant de p dans n!.** Parmi 1, 2, …, n, il y a n // p multiples de p, qui apportent chacun au moins un facteur p ; parmi eux, n // p² sont multiples de p² et apportent un facteur de plus ; etc. L'exposant de p dans n! vaut donc `n // p + n // p² + n // p³ + …`, une somme qui s'arrête dès que la puissance dépasse n. On le calcule en divisant n par p tant qu'il reste quelque chose.

**L'exposant de p dans C(N, K).** Comme C(N, K) × K! × (N − K)! = N!, les exposants s'additionnent : l'exposant de p dans C(N, K) est e = (exposant dans N!) − (exposant dans K!) − (exposant dans (N − K)!). Tout facteur premier de C(N, K) divise N!, donc est au plus N. On fait un crible d'Ératosthène jusqu'à N et, pour chaque nombre premier p, on multiplie la réponse par e + 1, modulo 1 000 000 007. Quand p ne divise pas C(N, K), e = 0 et le facteur vaut 1 : pas besoin de cas particulier.

Sur le deuxième exemple, C(10, 5) = 252. Pour p = 2 : 10 // 2 + 10 // 4 + 10 // 8 = 8, et 5 // 2 + 5 // 4 = 3 pour chacun des deux 5!, donc e = 8 − 3 − 3 = 2. De même, e = 2 pour p = 3, 0 pour p = 5 et 1 pour p = 7 : 252 = 2² × 3² × 7 a (2 + 1) × (2 + 1) × (1 + 1) = 18 diviseurs.

**Complexité.** Le crible coûte O(N log log N). Il y a 78 498 nombres premiers jusqu'à 10⁶, et chaque exposant se calcule en O(log N) divisions : quelques centaines de milliers d'opérations au total.

**Pourquoi la solution naïve est trop lente.** C(10⁶, 500 000) a plus de 300 000 chiffres. Le calculer est déjà lourd, et chercher ses facteurs premiers en le divisant demande des millions de divisions de ce nombre géant.

**Pièges.**
- La réponse se réduit modulo 1 000 000 007 au fur et à mesure, mais pas les exposants : ce sont de petits entiers exacts, qu'il ne faut pas réduire.
- Le nombre de diviseurs de C(N, K) n'est pas le nombre de diviseurs de N! divisé par ceux de K! et de (N − K)! : ce sont les exposants qui se soustraient, pas les nombres de diviseurs.
- N = 0 ou K = 0 donne C(N, K) = 1, qui a un seul diviseur. Attention au crible quand N vaut 0 ou 1.
