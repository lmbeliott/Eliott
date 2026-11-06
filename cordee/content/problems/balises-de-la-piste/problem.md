---
id: balises-de-la-piste
title: Les balises de la piste
chapter: n2-chaines
order: 4
tags: [chaînes, boucles]
samples: 2
---

## Énoncé
Le long du sentier des crêtes, chaque balise porte une lettre peinte. En montant, Chloé lit les lettres des balises dans l'ordre : elle obtient une chaîne `P`.

Ses amis lui lancent un défi : pour chaque mot qu'ils proposent, Chloé doit choisir des balises **dans l'ordre de la montée** dont les lettres, lues à la suite, forment exactement ce mot. Elle peut sauter autant de balises qu'elle veut, mais elle ne revient jamais en arrière et ne peut pas utiliser deux fois la même balise.

Par exemple, si `P` vaut `marmottes`, Chloé peut former `mot` (le premier `m`, le `o`, puis un `t`), mais pas `tom` : après le dernier `t`, il n'y a plus de `o`.

Écris un programme qui dit, pour chaque mot, si Chloé peut le former.

## Entrée
- La première ligne contient la chaîne `P`.
- La deuxième ligne contient un entier `Q` : le nombre de mots proposés.
- Les `Q` lignes suivantes contiennent chacune un mot.

Toutes les lettres sont des minuscules sans accents.

## Sortie
`Q` lignes : pour chaque mot, dans l'ordre de l'entrée, `oui` si Chloé peut le former, `non` sinon.

## Contraintes
- `P` contient entre 1 et 1 000 lettres.
- 1 ≤ Q ≤ 100
- Chaque mot contient entre 1 et 100 lettres.

## Indices
1. Fais-le à la main sur l'exemple : tu lis les balises une par une, et tu gardes en tête la prochaine lettre du mot que tu cherches.
2. Si la balise porte la lettre que tu cherches, prends-la tout de suite ! Il n'y a jamais d'intérêt à attendre une balise plus loin portant la même lettre : prendre la première te laisse plus de balises pour la suite du mot.
3. Garde un indice `j` : le nombre de lettres du mot déjà trouvées. Parcours `P` ; quand la lettre lue vaut `mot[j]`, augmente `j`. À la fin, le mot est formable si et seulement si `j` vaut la longueur du mot. N'oublie pas de vérifier `j < len(mot)` avant de lire `mot[j]`.

## Solution
On lit `P` une seule fois, de gauche à droite, en gardant un indice `j` sur la prochaine lettre du mot à trouver. À chaque balise, si sa lettre est égale à `mot[j]`, on la prend et on passe à la lettre suivante (`j` augmente de 1). Sinon, on la saute. Le mot est formable si, à la fin, toutes ses lettres ont été trouvées, c'est-à-dire si `j` vaut la longueur du mot.

Pourquoi est-ce correct de prendre toujours **la première** balise qui convient ? Si Chloé peut former le mot en utilisant une balise plus loin pour une lettre, elle peut aussi utiliser la première balise portant cette lettre : elle est encore plus tôt sur le sentier, donc toutes les balises choisies ensuite restent bien après elle.

Les pièges :
- ne pas chercher chaque lettre du mot depuis le début de `P` : l'ordre compte (`tom` n'est pas formable avec `marmottes`), et une balise ne sert qu'une fois (`aa` n'est pas formable avec `marmottes`, qui n'a qu'un seul `a`) ;
- une fois toutes les lettres trouvées, il ne faut plus lire `mot[j]`, qui n'existe pas : c'est le rôle du test `j < len(mot)` ;
- un mot plus long que `P` n'est jamais formable, et la méthode le dit bien toute seule.
