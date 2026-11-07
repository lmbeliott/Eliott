---
id: file-d-attente-a-un-guichet
title: File d'attente à un guichet
chapter: p1-synthese
order: 8
tags: [simulation]
samples: 2
---

## Énoncé
Un guichet sert les clients un par un, dans leur ordre d'arrivée. Chaque client arrive à un instant `T` et a besoin de `D` minutes au guichet. Il est servi dès son arrivée si le guichet est libre ; sinon, il attend que le client précédent ait terminé. Le guichet ne fait jamais de pause tant qu'un client attend.

Afficher le temps d'attente total de tous les clients (le temps passé dans la file, avant d'arriver au guichet), puis l'instant où le dernier client quitte le guichet.

## Entrée
- La première ligne contient l'entier `N`, le nombre de clients.
- Chacune des `N` lignes suivantes contient deux entiers `T` et `D` : l'instant d'arrivée et la durée de service d'un client. Les clients sont donnés dans l'ordre d'arrivée : les instants `T` ne diminuent jamais.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le temps d'attente total, puis l'instant où le dernier client a terminé.

## Contraintes
- 1 ≤ N ≤ 1 000
- 0 ≤ T ≤ 1 000 000
- 1 ≤ D ≤ 1 000

## Indices
1. Une seule information suffit pour décrire le guichet : l'instant où il sera libre. Au départ, il est libre à l'instant 0.
2. Quand un client arrive à l'instant `T`, il commence à être servi à l'instant le plus tardif entre `T` et l'instant où le guichet se libère.
3. Son attente est alors `début - T`, et le guichet sera libre à `début + D`.

## Solution
On simule le guichet client par client avec une seule variable d'état, `libre`, l'instant où le guichet sera disponible (0 au départ).

Pour chaque client `(T, D)` :
- il commence à être servi à l'instant `debut`, qui vaut `T` si le guichet est déjà libre (`libre ≤ T`), et `libre` sinon ;
- son attente est `debut - T`, qu'on ajoute au total ;
- le guichet sera libre à `libre = debut + D`.

À la fin, `libre` est l'instant où le dernier client termine.

Exemple : avec les clients `(0, 5)`, `(2, 3)` et `(20, 4)`, le premier est servi de 0 à 5 ; le deuxième, arrivé à 2, attend 3 minutes et est servi de 5 à 8 ; le troisième, arrivé à 20, trouve le guichet libre et termine à 24. La réponse est `3 24`.

Le piège : écrire `debut = libre` sans le `if`. Quand le guichet est libre depuis longtemps, le client aurait alors une attente négative, ou commencerait avant d'être arrivé.
