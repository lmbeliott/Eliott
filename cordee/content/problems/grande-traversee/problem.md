---
id: grande-traversee
title: La grande traversée
chapter: n3-dichotomie
order: 3
tags: [dichotomie, glouton]
samples: 2
---

## Énoncé
Hugo prépare la grande traversée de Valcorde. L'itinéraire est découpé en N tronçons qui se suivent, de longueurs L_1, L_2, …, L_N kilomètres, avec un refuge au bout de chaque tronçon.

Il veut faire la traversée en **exactement K jours**. Chaque jour, il parcourt un ou plusieurs tronçons consécutifs, dans l'ordre, et dort au refuge où il s'arrête. Il ne peut pas s'arrêter au milieu d'un tronçon. Pour ne pas s'épuiser, il veut que la plus longue de ses journées soit la plus courte possible.

Écris un programme qui calcule la distance de la plus longue journée, dans le meilleur découpage possible.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N entiers L_1, L_2, …, L_N.

## Sortie
Un seul entier : la plus petite valeur possible de la distance de la plus longue journée.

## Contraintes
- 1 ≤ K ≤ N ≤ 50 000
- 1 ≤ L_i ≤ 99

## Indices
1. Retourne la question : si Hugo s'interdit de marcher plus de D km par jour, de combien de jours a-t-il besoin au minimum ? Ce nombre se calcule en un seul parcours des tronçons.
2. Pour une limite D fixée, il suffit d'avancer le plus loin possible chaque jour, et de dormir au refuge dès que le tronçon suivant ferait dépasser D. Plus D est grand, moins il faut de jours : cherche la plus petite limite D par dichotomie.
3. D ne peut pas être plus petit que le plus long tronçon, et D = somme de tous les tronçons suffit toujours (un seul jour). Pourquoi « au plus K jours » donne-t-il la même réponse que « exactement K jours » ?

## Solution
**L'idée : chercher la réponse par dichotomie.** On se pose une question plus simple : « Peut-on faire la traversée en au plus K jours sans jamais dépasser D km par jour ? »

Pour y répondre, on marche le plus loin possible chaque jour : on ajoute les tronçons un par un, et dès que le suivant ferait dépasser D, on dort au refuge et on commence une nouvelle journée. Ce découpage glouton utilise le moins de jours possible : s'arrêter plus tôt un jour donné ne permet jamais d'aller plus loin ensuite. On compare son nombre de jours à K.

La réponse à cette question est « non » pour les petites valeurs de D, puis « oui » à partir d'un certain seuil : si D convient, D + 1 convient aussi. On cherche ce seuil par dichotomie entre `trop_petit = max(L) − 1` (un tronçon ne rentre dans aucune journée) et `suffisant = L_1 + … + L_N` (tout en un jour).

**Exactement K jours.** Le découpage glouton peut utiliser moins de K jours. Ce n'est pas grave : comme K ≤ N, on peut toujours couper une journée de plusieurs tronçons en deux pour arriver à exactement K jours, et couper une journée ne rallonge jamais la plus longue.

Sur le premier exemple (12 7 9 15 4 8, K = 3), avec D = 24 on obtient 12 + 7 | 9 + 15 | 4 + 8 : trois jours. Avec D = 23, il en faut quatre (12 + 7 | 9 | 15 + 4 | 8). La réponse est 24.

**Complexité.** La dichotomie fait environ log₂(50 000 × 99) ≈ 23 tours, chacun en O(N) : O(N log S), où S est la longueur totale. Environ un million d'opérations.

**Pourquoi la solution naïve est trop lente.** Essayer D = max(L), max(L) + 1, max(L) + 2… jusqu'à ce que ça marche coûte O(N) par valeur, et la réponse peut dépasser un million quand K est petit : plus de 10¹⁰ opérations. Essayer tous les découpages est encore pire.

**Pièges.**
- Commence la recherche à `max(L) − 1`, pas à 0 : avec une limite plus petite qu'un tronçon, le découpage glouton n'a pas de sens.
- Dans la dichotomie, garde bien le sens des bornes : `trop_petit` ne suffit jamais, `suffisant` suffit toujours, et on s'arrête quand elles sont voisines.
