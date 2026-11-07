---
id: systeme-de-deux-congruences
title: Système de deux congruences
chapter: p4-arithmetique
order: 7
tags: [arithmétique, mathématiques]
samples: 1
---

## Énoncé
Deux phares clignotent : le premier s'allume aux instants qui ont pour reste A₁ dans la division par M₁, le second aux instants qui ont pour reste A₂ dans la division par M₂. Afficher le premier instant x ≥ 0 où les deux s'allument ensemble, c'est-à-dire le plus petit x ≥ 0 tel que x ≡ A₁ (mod M₁) et x ≡ A₂ (mod M₂), ou `-1` si ce n'est jamais le cas.

Par exemple, avec x ≡ 2 (mod 3) et x ≡ 3 (mod 5), la réponse est 8. Avec x ≡ 1 (mod 4) et x ≡ 2 (mod 6), il n'y a pas de solution : x serait à la fois impair et pair.

Répondre à T questions.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient quatre entiers A₁, M₁, A₂ et M₂.

## Sortie
T lignes : pour chaque question, le plus petit x ≥ 0 solution, ou `-1`.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ M₁, M₂ ≤ 10⁹
- 0 ≤ A₁ < M₁ et 0 ≤ A₂ < M₂

## Indices
1. Les x de la première condition s'écrivent x = A₁ + M₁ × k. La seconde condition devient une congruence sur k : M₁ × k ≡ A₂ − A₁ (mod M₂).
2. C'est la congruence a × k ≡ b (mod m) du cours : avec g = PGCD(M₁, M₂), elle a des solutions si et seulement si g divise A₂ − A₁, et alors k est déterminé modulo M₂ / g.
3. Prendre le plus petit k ≥ 0. La réponse x = A₁ + M₁ × k est alors plus petite que PPCM(M₁, M₂), qui est au plus 10¹⁸.

## Solution
**Se ramener à une congruence.** Les x tels que x ≡ A₁ (mod M₁) sont les A₁ + M₁ × k avec k entier. Un tel x vérifie aussi x ≡ A₂ (mod M₂) si et seulement si M₁ × k ≡ A₂ − A₁ (mod M₂). Soit g = PGCD(M₁, M₂). Si g ne divise pas d = A₂ − A₁, il n'y a pas de solution : M₁ × k − d serait un multiple de M₂, donc de g, alors que M₁ × k l'est et d ne l'est pas.

**Résoudre.** Sinon, on divise par g : (M₁/g) × k ≡ d/g (mod M₂/g), et M₁/g est premier avec M₂/g. L'algorithme d'Euclide étendu donne un inverse u de M₁/g modulo M₂/g, et k ≡ u × (d/g) (mod M₂/g). On prend le plus petit k ≥ 0, entre 0 et M₂/g − 1, et x = A₁ + M₁ × k.

**C'est le plus petit.** Les solutions en k sont k + j × (M₂/g), et les solutions en x sont donc x + j × PPCM(M₁, M₂), puisque M₁ × M₂ / g = PPCM(M₁, M₂). Comme 0 ≤ k < M₂/g et A₁ < M₁, notre x est entre 0 et PPCM(M₁, M₂) − 1 : c'est la plus petite solution positive ou nulle. C'est le **théorème chinois des restes**, ici sans supposer M₁ et M₂ premiers entre eux.

**Les pièges.** d peut être négatif : en C++, on ramène d/g modulo M₂/g entre 0 et M₂/g − 1 avant de multiplier par u, lui aussi ramené entre 0 et M₂/g − 1 ; le produit reste inférieur à 10¹⁸. M₁ × k est inférieur au PPCM, donc à 10¹⁸. **Coût** : O(log) par question ; essayer les x = A₁, A₁ + M₁, … demanderait jusqu'à 10⁹ essais par question.
