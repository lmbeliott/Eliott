---
id: mots-sans-bloc-double
title: Mots sans bloc doublé
chapter: p4-exploration
order: 6
tags: [backtracking, chaînes, mathématiques]
samples: 2
---

## Énoncé
On considère les mots écrits avec les trois lettres `a`, `b` et `c`. Un mot contient un **bloc doublé** s'il contient deux morceaux identiques collés l'un à l'autre : par exemple `abcbc` contient `bcbc`, `cabbac` contient `bb`, et `abacabac` est lui-même formé de `abac` répété. Le mot `abcacb` ne contient aucun bloc doublé.

On donne une longueur `N` et un début de mot `P`. Compter les mots de longueur `N` qui commencent par `P` et ne contiennent aucun bloc doublé, et donner le premier d'entre eux dans l'ordre alphabétique.

## Entrée
Une seule ligne contenant l'entier `N` et le mot `P`, séparés par une espace.

## Sortie
Sur la première ligne, le nombre de mots qui conviennent. S'il est différent de 0, sur la deuxième ligne, le premier de ces mots dans l'ordre alphabétique.

## Contraintes
- 1 ≤ N ≤ 30
- 1 ≤ longueur de `P` ≤ N, et `P` ne contient que les lettres `a`, `b` et `c`

## Indices
1. Il y a `3^30 ≈ 2 × 10¹⁴` mots de longueur 30 : impossible de tous les écrire. Construire le mot lettre par lettre et abandonner une branche dès qu'un bloc doublé apparaît.
2. Si le mot `w` n'a pas de bloc doublé, un bloc doublé de `w` suivi d'une lettre doit se terminer à la fin du mot : il suffit de comparer, pour chaque longueur `l`, les `l` dernières lettres aux `l` précédentes.
3. Si l'on essaie les lettres dans l'ordre `a`, `b`, `c`, le premier mot complet trouvé est le plus petit dans l'ordre alphabétique.

## Solution
On construit le mot lettre par lettre, par retour sur trace. Après chaque ajout, on vérifie que le mot ne se **termine** pas par un bloc doublé : pour chaque longueur `l` de 1 à la moitié de la longueur, on compare les `l` dernières lettres aux `l` lettres qui les précèdent. C'est suffisant, car tout bloc doublé qui ne touche pas la dernière lettre était déjà présent avant l'ajout, et la branche aurait été coupée plus tôt. On commence par ajouter les lettres de `P` (si l'une d'elles crée un bloc doublé, la réponse est 0), puis on essaie `a`, `b` et `c` à chaque position.

**Compter et trouver.** Quand le mot atteint la longueur `N`, on le compte ; le premier mot complet rencontré est le plus petit, car les branches sont explorées dans l'ordre alphabétique. Pour seulement trouver ce mot, on pourrait s'arrêter là ; pour compter, il faut parcourir tout l'arbre.

**Taille de l'arbre.** Les nœuds de l'arbre sont exactement les mots sans bloc doublé de longueur au plus `N` qui commencent par `P`. Leur nombre grandit lentement : il y a 34 422 mots de longueur 30 sans bloc doublé, et environ 150 000 nœuds en tout. Chaque nœud coûte O(N²) comparaisons au pire, souvent beaucoup moins car les comparaisons s'arrêtent à la première différence.

**Un peu de mathématiques.** Avec seulement deux lettres, tout mot de longueur 4 contient un bloc doublé (essayer `abab`, `abba`, `abaa`…). Avec trois lettres, un théorème d'Axel Thue (1906) affirme qu'il existe des mots sans bloc doublé de toute longueur. Certains débuts de mot ne se prolongent pourtant pas : `abacaba` ne peut être suivi d'aucune lettre.
