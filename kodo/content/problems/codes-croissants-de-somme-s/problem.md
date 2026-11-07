---
id: codes-croissants-de-somme-s
title: Codes croissants de somme S
chapter: n3-recursivite
order: 1
tags: [récursivité]
samples: 2
---

## Énoncé
Un cadenas a N molettes, chacune affichant un chiffre de `0` à `9`. On cherche tous les codes qui respectent deux règles :
- en lisant de gauche à droite, les chiffres ne diminuent jamais (chaque chiffre est supérieur ou égal au précédent) ;
- la somme des N chiffres vaut S.

Écris un programme qui affiche tous ces codes.

## Entrée
Une seule ligne contenant deux entiers N et S.

## Sortie
- Sur la première ligne, le nombre de codes possibles.
- Puis un code par ligne, écrit avec ses N chiffres collés (y compris les `0` du début), du plus petit au plus grand.

Si aucun code ne convient, affiche seulement `0`.

## Contraintes
- 1 ≤ N ≤ 10
- 0 ≤ S ≤ 90

## Indices
1. Essayer les 10ᴺ codes possibles un par un, c'est 10 milliards de codes quand N = 10 : beaucoup trop. Il faut construire seulement les codes qui respectent les règles.
2. Écris une fonction récursive qui choisit les chiffres de gauche à droite. Elle a besoin de savoir quelle somme il reste à atteindre et quel est le plus petit chiffre autorisé (le chiffre précédent).
3. Si tu essaies les chiffres dans l'ordre croissant à chaque position, les codes sortent directement du plus petit au plus grand. Pour aller plus vite, abandonne une branche dès que la somme restante ne peut plus être atteinte.

## Solution
**L'idée : construire les codes chiffre par chiffre, récursivement.** La fonction `explorer(reste, plus_petit)` connaît les chiffres déjà choisis (dans une liste `code`), la somme `reste` qu'il faut encore atteindre et le plus petit chiffre autorisé pour la position suivante. Si tous les chiffres sont choisis, on garde le code quand `reste` vaut 0. Sinon, pour chaque chiffre c de `plus_petit` à 9, on l'ajoute au code, on appelle `explorer(reste − c, c)`, puis on le retire : c'est le retour en arrière.

**L'ordre.** Tous les codes ont N chiffres, donc « du plus petit au plus grand » revient à l'ordre alphabétique. Comme on essaie les chiffres dans l'ordre croissant à chaque position, tous les codes qui commencent par 0 sortent avant ceux qui commencent par 1, et ainsi de suite : la liste est déjà dans le bon ordre, sans tri.

**Élaguer.** S'il reste p chiffres à choisir (en comptant celui qu'on place) et qu'on place c, ces p chiffres valent tous au moins c : si `c × p > reste`, ce chiffre et tous les suivants sont trop grands, on arrête la boucle. Et si `c + 9 × (p − 1) < reste`, même avec des 9 partout ensuite on n'atteint pas la somme : on passe au chiffre suivant.

**Complexité.** Il n'existe que 92 378 suites croissantes (au sens large) de 10 chiffres, et l'élagage évite presque toutes les branches inutiles : sur les plus gros tests, la fonction est appelée environ 11 000 fois, pour moins de 3 000 codes affichés.

**Pourquoi la solution naïve est trop lente.** Tester les 10ᴺ codes (par exemple avec dix boucles imbriquées) fait 10¹⁰ essais pour N = 10 : plusieurs heures en Python.

**Pièges.**
- Affiche les zéros du début : le code `006` ne doit pas devenir `6`.
- N'oublie pas d'afficher le nombre de codes en premier, même s'il vaut 0.
