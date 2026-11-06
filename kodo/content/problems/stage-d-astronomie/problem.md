---
id: stage-d-astronomie
title: Le stage d'astronomie
chapter: n3-complexite
order: 4
tags: [deux-pointeurs, chaînes]
samples: 2
---

## Énoncé
À l'observatoire de Valcorde, Nathan note chaque nuit la constellation la mieux visible, codée par une lettre minuscule. Son carnet couvre N nuits consécutives : c'est une chaîne de N lettres, la i-ème lettre correspondant à la nuit numéro i.

L'an prochain, il veut organiser un stage de plusieurs nuits consécutives, aux mêmes dates. Pendant le stage, les élèves doivent pouvoir observer **toutes** les constellations qui apparaissent dans le carnet, au moins une nuit chacune.

Écris un programme qui trouve le stage le plus court possible. S'il y a plusieurs stages de durée minimale, choisis celui qui commence le plus tôt.

## Entrée
- La première ligne contient un entier N.
- La deuxième ligne contient le carnet : N lettres minuscules collées.

## Sortie
Deux entiers séparés par une espace : la durée minimale du stage (en nuits), puis le numéro de sa première nuit (les nuits sont numérotées de 1 à N).

## Contraintes
- 1 ≤ N ≤ 100 000
- Le carnet ne contient que des lettres de `a` à `z`.

## Indices
1. Commence par compter le nombre de lettres différentes du carnet : c'est le nombre de constellations que le stage doit contenir.
2. Utilise une fenêtre de nuits `debut..fin` et un tableau qui compte combien de fois chaque lettre apparaît dans la fenêtre. Garde aussi le nombre de lettres différentes présentes dans la fenêtre, pour ne pas le recalculer à chaque fois.
3. Fais avancer `fin` d'une nuit à la fois. Dès que la fenêtre contient toutes les constellations, enregistre-la si elle est plus courte que la meilleure trouvée, puis avance `debut` pour essayer de la raccourcir, et recommence tant qu'elle contient encore tout.

## Solution
**L'idée : une fenêtre glissante avec des compteurs.** On note `a_voir` le nombre de lettres différentes du carnet. On fait avancer `fin` de nuit en nuit, et on tient à jour :
- `compte[c]`, le nombre de nuits de la fenêtre `debut..fin` où l'on voit la constellation c ;
- `vues`, le nombre de constellations différentes présentes dans la fenêtre (il augmente quand un compteur passe de 0 à 1 et diminue quand il retombe à 0).

Après avoir ajouté la nuit `fin`, tant que `vues == a_voir`, la fenêtre est un stage valable : on le compare au meilleur, puis on retire la nuit `debut` et on avance `debut`. Quand la boucle s'arrête, `debut` a dépassé le début du plus court stage valable qui finit à la nuit `fin`.

Pourquoi `debut` n'a-t-il jamais besoin de reculer ? On n'avance `debut` au-delà d'une nuit l que lorsque la fenêtre qui commence à l contient tout : ce stage a alors été enregistré. Tout stage qui commence aussi à la nuit l mais finit plus tard est plus long, donc jamais meilleur.

**Départager les ex æquo.** Les stages sont examinés par `fin` croissante, et pour une même durée, `fin` plus petite veut dire `debut` plus petit. En ne remplaçant le meilleur que si la nouvelle durée est **strictement** plus petite, on garde le stage qui commence le plus tôt.

**Complexité.** `fin` et `debut` avancent chacun au plus N fois : O(N), avec un tableau de 26 compteurs.

**Pourquoi la solution naïve est trop lente.** Essayer chaque nuit de départ et avancer jusqu'à avoir tout vu coûte de l'ordre de N × (durée du stage). Si deux constellations rares n'apparaissent qu'au tout début et à la toute fin du carnet, le stage couvre presque tout : environ N²/2 = 5 × 10⁹ opérations.

**Pièges.**
- Ne recalcule pas le nombre de lettres différentes de la fenêtre à chaque étape (par exemple avec `len(set(...))`) : c'est justement ce qui rend la solution lente. Le compteur `vues` se met à jour en temps constant.
- Les nuits sont numérotées à partir de 1 : pense à ajouter 1 à l'indice de début avant de l'afficher.
