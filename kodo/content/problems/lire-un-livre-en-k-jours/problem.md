---
id: lire-un-livre-en-k-jours
title: Lire un livre en K jours
chapter: n3-dichotomie
order: 3
tags: [dichotomie, glouton]
samples: 2
---

## Énoncé
Un livre compte N chapitres, et le chapitre i fait L_i pages. Tu veux le lire en **exactement K jours** : chaque jour, tu lis un ou plusieurs chapitres consécutifs, en entier et dans l'ordre.

Écris un programme qui calcule le plus petit nombre de pages possible pour la journée la plus chargée, dans le meilleur découpage.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers L_1, L_2, …, L_N.

## Sortie
Un seul entier : la plus petite valeur possible du nombre de pages lues pendant la journée la plus chargée.

## Contraintes
- 1 ≤ K ≤ N ≤ 25 000
- 1 ≤ L_i ≤ 10 000

## Indices
1. Retourne la question : si tu t'interdis de lire plus de D pages par jour, de combien de jours as-tu besoin au minimum ? Ce nombre se calcule en un seul parcours des chapitres.
2. Pour une limite D fixée, il suffit de lire le plus possible chaque jour, et de s'arrêter dès que le chapitre suivant ferait dépasser D. Plus D est grand, moins il faut de jours : cherche la plus petite limite D par dichotomie.
3. D ne peut pas être plus petit que le plus long chapitre, et D = somme de tous les chapitres suffit toujours (un seul jour). Pourquoi « au plus K jours » donne-t-il la même réponse que « exactement K jours » ?

## Solution
**L'idée : chercher la réponse par dichotomie.** On se pose une question plus simple : « Peut-on lire le livre en au plus K jours sans jamais dépasser D pages par jour ? »

Pour y répondre, on lit le plus possible chaque jour : on ajoute les chapitres un par un, et dès que le suivant ferait dépasser D, on s'arrête et on commence une nouvelle journée. Ce découpage glouton utilise le moins de jours possible : s'arrêter plus tôt un jour donné ne permet jamais d'aller plus loin ensuite. On compare son nombre de jours à K.

La réponse à cette question est « non » pour les petites valeurs de D, puis « oui » à partir d'un certain seuil : si D convient, D + 1 convient aussi. On cherche ce seuil par dichotomie entre `trop_petit = max(L) − 1` (un chapitre ne rentre dans aucune journée) et `suffisant = L_1 + … + L_N` (tout en un jour).

**Exactement K jours.** Le découpage glouton peut utiliser moins de K jours. Ce n'est pas grave : comme K ≤ N, on peut toujours couper une journée de plusieurs chapitres en deux pour arriver à exactement K jours, et couper une journée ne rallonge jamais la plus longue.

Sur le premier exemple (12 7 9 15 4 8, K = 3), avec D = 24 on obtient 12 + 7 | 9 + 15 | 4 + 8 : trois jours. Avec D = 23, il en faut quatre (12 + 7 | 9 | 15 + 4 | 8). La réponse est 24.

**Complexité.** La dichotomie fait environ log₂(25 000 × 10 000) ≈ 28 tours, chacun en O(N) : O(N log S), où S est le nombre total de pages. Moins d'un million d'opérations.

**Pourquoi la solution naïve est trop lente.** Essayer D = max(L), max(L) + 1, max(L) + 2… jusqu'à ce que ça marche coûte O(N) par valeur, et la réponse peut dépasser 10⁸ quand K est petit : plus de 10¹² opérations. Partir de la moyenne ⌈S / K⌉ (la journée la plus chargée en contient au moins autant) ne suffit pas non plus : la réponse peut en être éloignée de plusieurs milliers, et autant d'essais restent trop lents en Python. Essayer tous les découpages est encore pire.

**Pièges.**
- Commence la recherche à `max(L) − 1`, pas à 0 : avec une limite plus petite qu'un chapitre, le découpage glouton n'a pas de sens.
- Dans la dichotomie, garde bien le sens des bornes : `trop_petit` ne suffit jamais, `suffisant` suffit toujours, et on s'arrête quand elles sont voisines.
