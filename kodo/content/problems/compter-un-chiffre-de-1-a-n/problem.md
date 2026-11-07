---
id: compter-un-chiffre-de-1-a-n
title: Compter un chiffre de 1 à N
chapter: p3-synthese
order: 5
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
On écrit tous les entiers de 1 à N en base 10, sans zéro inutile à gauche. Combien de fois le chiffre c apparaît-il ? Par exemple, de 1 à 13, le chiffre 1 apparaît 6 fois : dans 1, 10, 11 (deux fois), 12 et 13.

Répondre à Q questions de ce type.

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient N et c.

## Sortie
Q lignes : pour chaque question, le nombre d'apparitions du chiffre c.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ N ≤ 10¹⁸
- 0 ≤ c ≤ 9

## Indices
1. Écrire les nombres un par un est impossible pour N = 10¹⁸. Compter plutôt position par position : combien de nombres de 1 à N ont le chiffre c à la position des unités ? des dizaines ? des centaines ?
2. Pour la position de poids p = 10^k, découper N en trois morceaux : la partie **haute** h = ⌊N / (10p)⌋, le chiffre **courant** d = ⌊N/p⌋ mod 10, et la partie **basse** b = N mod p. Les nombres de 0 à N dont le chiffre de poids p vaut c se comptent à partir de h, d et b.
3. Le chiffre 0 demande une correction : un nombre n'a pas de zéro à gauche, donc la partie haute d'un nombre qui a un 0 en position p ne peut pas être vide.

## Solution
On compte séparément, pour chaque position p = 1, 10, 100…, les nombres x entre 1 et N dont le chiffre de poids p vaut c. Écrivons N = h × 10p + d × p + b, avec h la partie haute, d le chiffre de poids p et 0 ≤ b < p la partie basse. Un nombre x ≤ N dont le chiffre de poids p vaut c s'écrit x = h' × 10p + c × p + b', avec 0 ≤ b' < p.

**Cas c ≥ 1.**
- Si h' < h, toutes les valeurs de b' conviennent : h choix pour h', p choix pour b', soit h × p nombres.
- Si h' = h : si c < d, les p valeurs de b' conviennent ; si c = d, il faut b' ≤ b, soit b + 1 valeurs ; si c > d, aucune.

**Cas c = 0.** La partie haute h' d'un nombre qui a un 0 à la position p doit être au moins 1 (sinon ce 0 serait un zéro à gauche). On compte de même avec h' de 1 à h − 1, ce qui donne (h − 1) × p, puis h' = h selon d, mais seulement si h ≥ 1.

La réponse est la somme sur les 19 positions possibles. Par exemple, pour N = 13 et c = 1 : à la position des unités, h = 1, d = 3, b = 0, ce qui donne 1 × 1 + 1 = 2 (les nombres 1 et 11) ; à la position des dizaines, h = 0, d = 1, b = 3, ce qui donne 0 + (3 + 1) = 4 (de 10 à 13). Total : 6.

**Correction.** Chaque apparition du chiffre c dans l'écriture d'un nombre x est comptée une fois, à sa position, et les cas ci-dessus décrivent exactement les x ≤ N concernés, car comparer x à N revient à comparer d'abord les parties hautes, puis les chiffres de poids p, puis les parties basses.

**Coût.** 19 positions par question : O(log N), contre O(N log N) pour écrire tous les nombres. La réponse peut approcher 2 × 10¹⁸ : `long long` en C++. Attention à 10p, qui dépasse la capacité d'un `long long` quand p = 10¹⁸ : on calcule h comme ⌊⌊N/p⌋/10⌋, et on ne multiplie p par 10 que s'il reste au plus N.
