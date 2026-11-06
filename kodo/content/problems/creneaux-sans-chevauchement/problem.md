---
id: creneaux-sans-chevauchement
title: Créneaux sans chevauchement
chapter: n3-glouton
order: 2
tags: [glouton, tri]
samples: 2
---

## Énoncé
Une salle ne peut accueillir qu'une réservation à la fois. N demandes sont arrivées : la demande numéro i commence à la minute D_i et dure L_i minutes, c'est-à-dire qu'elle occupe la salle de la minute D_i (incluse) à la minute D_i + L_i (exclue).

Chaque demande est acceptée ou refusée en entier : on ne peut ni déplacer ni raccourcir un créneau. Deux créneaux acceptés ne doivent pas se chevaucher, mais un créneau peut commencer exactement à la minute où le précédent termine.

Écris un programme qui calcule le plus grand nombre de demandes que l'on peut accepter.

## Entrée
- La première ligne contient un entier N.
- Chacune des N lignes suivantes contient deux entiers D_i et L_i.

## Sortie
Un seul entier : le nombre maximal de créneaux acceptés.

## Contraintes
- 1 ≤ N ≤ 15 000
- 0 ≤ D_i ≤ 99 999
- 1 ≤ L_i ≤ 500

## Indices
1. Accepter d'abord les créneaux qui commencent le plus tôt, ou les plus courts, ne marche pas toujours : cherche un contre-exemple. Quel créneau laisse la salle libre le plus tôt possible pour la suite ?
2. Parmi tous les créneaux, celui qui **finit** le plus tôt peut toujours être accepté sans regret. Trie les créneaux par heure de fin.
3. Parcours les créneaux par fin croissante, en retenant le moment où la salle se libère. Accepte un créneau si son début est supérieur ou égal à ce moment.

## Solution
**L'idée gloutonne : finir le plus tôt possible.** On calcule l'heure de fin `F_i = D_i + L_i` de chaque créneau, et on trie les créneaux par fin croissante. On les parcourt dans cet ordre en retenant `salle_libre_a`, la fin du dernier créneau accepté : si `D_i ≥ salle_libre_a`, on accepte le créneau et `salle_libre_a` devient `F_i` ; sinon, on le refuse.

**Pourquoi c'est optimal (argument d'échange).** Soit g le créneau qui finit le plus tôt, et prenons une solution optimale quelconque. Son premier créneau o finit au plus tôt à `F_g`, puisque g finit avant tous les autres. Remplaçons o par g : g finit avant (ou en même temps que) o, donc il ne chevauche aucun des créneaux suivants de la solution, qui commencent tous après la fin de o. On obtient une solution valable avec autant de créneaux, qui commence par g. Il existe donc une solution optimale qui commence comme le glouton. On recommence avec les créneaux qui commencent après `F_g`, et ainsi de suite.

**Les autres idées échouent.** Sur le deuxième exemple, le créneau qui commence le plus tôt (minute 10, pendant 300 minutes) bloque les trois autres : accepter « le plus tôt d'abord » donne 1 au lieu de 3. Choisir les créneaux les plus courts d'abord échoue aussi, par exemple avec [0, 10), [8, 13) et [12, 22) : le plus court, [8, 13), bloque les deux autres.

**Complexité.** Le tri coûte O(N log N), le parcours O(N).

**Pourquoi la solution naïve est trop lente.** Essayer tous les sous-ensembles de demandes est exponentiel : il y en a 2ᴺ. Une programmation dynamique qui, pour chaque créneau, regarde tous les créneaux précédents coûte O(N²), soit plus de 10⁸ opérations : une dizaine de secondes en Python.

**Pièges.**
- Les créneaux sont semi-ouverts : un créneau qui commence à la minute 60 est compatible avec un créneau qui finit à la minute 60. D'où la condition `D_i ≥ salle_libre_a` (et non `>`).
- Trie bien par heure de **fin**, pas par heure de début ni par durée.
