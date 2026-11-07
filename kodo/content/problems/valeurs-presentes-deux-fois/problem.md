---
id: valeurs-presentes-deux-fois
title: Valeurs présentes deux fois
chapter: n4-defis
order: 3
tags: [fenwick, tri, sommes-préfixes]
samples: 2
---

## Énoncé
On donne un tableau `a[1..N]` d'entiers et `Q` requêtes. Chaque requête est un intervalle `[l, r]`.

Écris un programme qui affiche, pour chaque requête, le nombre de valeurs distinctes qui apparaissent **exactement deux fois** parmi `a[l], a[l+1], …, a[r]`.

## Entrée
La première ligne contient trois entiers `N`, `Q` et `G`.

**Si `G = 0`**, les données sont écrites en entier :
- la deuxième ligne contient les `N` entiers `a[1]`, …, `a[N]` ;
- les `Q` lignes suivantes contiennent chacune deux entiers `l` et `r`.

**Si `G > 0`**, la deuxième ligne contient deux entiers `V` et `D`, et les données sont produites par un générateur. On part de `x = G`, et chaque appel à `suivant()` fait :
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴` ;
- puis renvoie `x` divisé par `2³³` (division entière).

On calcule d'abord `a[i] = 1 + (suivant() mod V)` pour `i` de `1` à `N`. Ensuite, pour chaque requête, dans l'ordre : `l = 1 + (suivant() mod D)`, puis `r = N - (suivant() mod D)`, et on échange `l` et `r` si `l > r`.

Par exemple, avec `G = 2`, les premiers appels à `suivant()` renvoient `1649717740`, `1969491882` et `1484760456`. Avec `N = 10`, `V = 5` et `D = 6`, le tableau est `1 3 2 5 1 5 4 4 1 3`. En C++, le calcul modulo 2⁶⁴ est automatique avec `unsigned long long`. En Python, utilise `% 2**64`.

## Sortie
`Q` lignes : la réponse à chaque requête, dans l'ordre.

## Contraintes
- 1 ≤ N, Q ≤ 100 000
- 1 ≤ a[i] ≤ N
- 1 ≤ V ≤ N et 1 ≤ D ≤ N
- 1 ≤ l ≤ r ≤ N

## Indices
1. Fixe l'extrémité droite `r`. Pour une valeur `v`, note `p₁ < p₂` ses deux dernières occurrences jusqu'à `r` et `p₀` celle d'avant (`0` s'il n'y en a pas). Pour quels `l` la valeur `v` apparaît-elle exactement deux fois dans `[l, r]` ?
2. C'est le cas exactement pour `p₀ < l ≤ p₁`. Chaque valeur ajoute donc `1` à un intervalle de positions `l`, et la réponse à `[l, r]` est le total accumulé en `l`.
3. Traite les requêtes par `r` croissant (hors ligne). Quand `r` avance d'une case, une seule valeur change d'intervalle : retire l'ancien, ajoute le nouveau. Un arbre de Fenwick sur les différences fait chaque ajout d'intervalle et chaque lecture en O(log N).

## Solution
**Pour un `r` fixé.** Soit `v` une valeur, `p₁ < p₂` ses deux dernières occurrences dans `a[1..r]` et `p₀` l'occurrence d'avant (`0` si elle n'existe pas). L'intervalle `[l, r]` contient exactement les occurrences `≥ l`. Il en contient exactement deux si et seulement si `p₀ < l ≤ p₁`. Posons `c_r(l)` le nombre de valeurs dont l'intervalle `]p₀, p₁]` contient `l`. La réponse à la requête `[l, r]` est `c_r(l)`.

**Balayage.** On fait avancer `r` de `1` à `N` en traitant les requêtes **hors ligne**, regroupées par leur `r`. Quand on ajoute la position `r`, de valeur `v`, seuls les intervalles de `v` changent. L'ancien `]p₀, p₁]` disparaît et le nouveau `]p₁, p₂]` apparaît, avec `p₂` l'ancienne dernière occurrence. On garde pour chaque valeur ses trois dernières positions.

**Fenwick.** Ajouter `1` sur tout un intervalle `]x, y]` revient, sur le tableau des différences, à ajouter `+1` en `x + 1` et `-1` en `y + 1`. La valeur `c_r(l)` est alors la somme des différences jusqu'à `l` : une somme de préfixe. Un arbre de Fenwick fait chaque opération en O(log N). Chaque position cause au plus 4 mises à jour, chaque requête une lecture.

Complexité : **O((N + Q) log N)**.

Pourquoi les idées simples échouent : compter les valeurs de chaque requête une par une coûte O(N) par requête. Les tests ont des intervalles presque entiers, soit 10¹⁰ opérations. Un arbre de segments qui stockerait « le nombre de valeurs vues deux fois » ne se combine pas : on ne sait pas fusionner deux moitiés sans connaître toutes leurs valeurs. C'est le balayage qui rend le problème simple.

Pièges :
- `p₀`, `p₁` ou `p₂` peuvent ne pas exister : avec une seule occurrence, l'intervalle est vide.
- Avec le générateur, l'ordre des appels compte : tout le tableau d'abord, puis pour chaque requête `l` avant `r`.
- En Python, le produit de `x` par la constante dépasse 2⁶⁴ : prends le reste modulo 2⁶⁴ à chaque étape.
