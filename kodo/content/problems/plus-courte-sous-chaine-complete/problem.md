---
id: plus-courte-sous-chaine-complete
title: Plus courte sous-chaîne complète
chapter: n3-complexite
order: 4
tags: [deux-pointeurs, chaînes]
samples: 2
---

## Énoncé
On te donne une chaîne de N lettres minuscules. Une sous-chaîne (une suite de lettres consécutives de la chaîne) est **complète** si elle contient au moins une fois chacune des lettres qui apparaissent dans la chaîne.

Écris un programme qui trouve la plus courte sous-chaîne complète. S'il y en a plusieurs de longueur minimale, choisis celle qui commence le plus tôt.

## Entrée
- La première ligne contient un entier N.
- La deuxième ligne contient la chaîne : N lettres minuscules collées.

## Sortie
Deux entiers séparés par une espace : la longueur minimale d'une sous-chaîne complète, puis la position de sa première lettre (les positions sont numérotées de 1 à N).

## Contraintes
- 1 ≤ N ≤ 100 000
- La chaîne ne contient que des lettres de `a` à `z`.

## Indices
1. Commence par compter le nombre de lettres différentes de la chaîne : c'est le nombre de lettres que la sous-chaîne doit contenir.
2. Utilise une fenêtre de positions `debut..fin` et un tableau qui compte combien de fois chaque lettre apparaît dans la fenêtre. Garde aussi le nombre de lettres différentes présentes dans la fenêtre, pour ne pas le recalculer à chaque fois.
3. Fais avancer `fin` d'une position à la fois. Dès que la fenêtre contient toutes les lettres, enregistre-la si elle est plus courte que la meilleure trouvée, puis avance `debut` pour essayer de la raccourcir, et recommence tant qu'elle contient encore tout.

## Solution
**L'idée : une fenêtre glissante avec des compteurs.** On note `a_voir` le nombre de lettres différentes de la chaîne. On fait avancer `fin` d'une position à la fois, et on tient à jour :
- `compte[c]`, le nombre de fois où la lettre c apparaît dans la fenêtre `debut..fin` ;
- `vues`, le nombre de lettres différentes présentes dans la fenêtre (il augmente quand un compteur passe de 0 à 1 et diminue quand il retombe à 0).

Après avoir ajouté la position `fin`, tant que `vues == a_voir`, la fenêtre est une sous-chaîne complète : on la compare à la meilleure, puis on retire la lettre en position `debut` et on avance `debut`. Quand la boucle s'arrête, `debut` a dépassé le début de la plus courte sous-chaîne complète qui finit en position `fin`.

Pourquoi `debut` n'a-t-il jamais besoin de reculer ? On n'avance `debut` au-delà d'une position l que lorsque la fenêtre qui commence en l contient tout : cette sous-chaîne a alors été enregistrée. Toute sous-chaîne qui commence aussi en l mais finit plus loin est plus longue, donc jamais meilleure.

**Départager les ex æquo.** Les sous-chaînes sont examinées par `fin` croissante, et pour une même longueur, `fin` plus petite veut dire `debut` plus petit. En ne remplaçant la meilleure que si la nouvelle longueur est **strictement** plus petite, on garde celle qui commence le plus tôt.

**Complexité.** `fin` et `debut` avancent chacun au plus N fois : O(N), avec un tableau de 26 compteurs.

**Pourquoi la solution naïve est trop lente.** Essayer chaque position de départ et avancer jusqu'à avoir tout vu coûte jusqu'à N²/2 opérations : depuis chaque départ, on peut devoir parcourir toute la fin de la chaîne (par exemple quand une lettre rare n'apparaît qu'une fois). Pour N = 100 000, cela fait environ 5 × 10⁹ opérations.

**Pièges.**
- Ne recalcule pas le nombre de lettres différentes de la fenêtre à chaque étape (par exemple avec `len(set(...))`) : c'est justement ce qui rend la solution lente. Le compteur `vues` se met à jour en temps constant.
- Les positions sont numérotées à partir de 1 : pense à ajouter 1 à l'indice de début avant de l'afficher.
