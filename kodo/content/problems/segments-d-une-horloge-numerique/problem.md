---
id: segments-d-une-horloge-numerique
title: Segments d'une horloge numérique
chapter: n2-fonctions
order: 6
tags: [fonctions, chaînes]
samples: 2
---

## Énoncé
Une horloge numérique affiche l'heure sous la forme `hh:mm` avec quatre chiffres. Chaque chiffre est dessiné avec 7 segments, nommés de `a` à `g` :

```
 aaa
f   b
f   b
 ggg
e   c
e   c
 ddd
```

Voici les segments allumés pour chaque chiffre :

| Chiffre | Segments | Chiffre | Segments |
| --- | --- | --- | --- |
| `0` | `abcdef` | `5` | `acdfg` |
| `1` | `bc` | `6` | `acdefg` |
| `2` | `abdeg` | `7` | `abc` |
| `3` | `abcdg` | `8` | `abcdefg` |
| `4` | `bcfg` | `9` | `abcdfg` |

Chaque minute, l'affichage passe à l'heure suivante, et certains segments **basculent** : ils s'allument ou s'éteignent. Par exemple, de `09:59` à `10:00`, le premier chiffre passe de `0` à `1` : les segments `a`, `d`, `e` et `f` s'éteignent, soit 4 bascules. Après `23:59`, l'horloge affiche `00:00`.

Écris un programme qui répond à `Q` questions : pour chacune, l'horloge avance minute par minute d'une heure de départ jusqu'à une heure d'arrivée, et le programme affiche le nombre total de bascules de segments.

## Entrée
- La première ligne contient l'entier `Q`, le nombre de questions.
- Les `Q` lignes suivantes contiennent chacune deux heures `hh:mm` séparées par une espace : l'heure de départ, puis l'heure d'arrivée.

Si l'heure d'arrivée est avant l'heure de départ, l'horloge passe par `00:00`. Si les deux heures sont égales, l'horloge ne bouge pas.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre, le nombre total de segments qui basculent pendant que l'horloge avance de l'heure de départ jusqu'à l'heure d'arrivée.

## Contraintes
- 1 ≤ Q ≤ 20
- Les heures vont de `00:00` à `23:59`.

## Indices
1. Découpe le problème. Une fonction `bascules(x, y)` compte les segments qui changent quand un chiffre `x` devient un chiffre `y` : ce sont les lettres de `a` à `g` présentes dans l'un des deux dessins mais pas dans l'autre.
2. Compte les heures en minutes depuis `00:00` (de 0 à 1 439) : avancer d'une minute, c'est passer de `t` à `(t + 1) % 1440`. Une fonction `chiffres(t)` redonne les quatre chiffres affichés : `t // 60` donne les heures, `t % 60` les minutes.
3. Une fonction `transition(t)` additionne les bascules des quatre chiffres entre `t` et la minute suivante. Le programme principal part de l'heure de départ et appelle `transition` jusqu'à atteindre l'heure d'arrivée.

## Solution
On découpe le problème en petites fonctions, chacune facile à vérifier seule :
- `en_minutes(h)` transforme `"09:59"` en `599` (9 × 60 + 59) ;
- `chiffres(t)` fait le chemin inverse et renvoie les quatre chiffres affichés : `t // 60` heures et `t % 60` minutes, chacun coupé en dizaines et unités ;
- `bascules(x, y)` parcourt les 7 lettres de `a` à `g` et compte celles qui sont allumées dans un seul des deux chiffres ;
- `transition(t)` additionne `bascules` sur les quatre positions, entre les chiffres de `t` et ceux de `(t + 1) % 1440`.

Le programme principal part de la minute de départ et avance tant qu'il n'a pas atteint la minute d'arrivée, en ajoutant `transition(t)` à chaque pas. Le `% 1440` fait passer de `23:59` (minute 1 439) à `00:00` (minute 0), ce qui règle tout seul le cas où l'arrivée est avant le départ.

Dans le premier exemple, de `09:59` à `10:00` : `0` devient `1` (4 bascules), `9` devient `0` (`e` s'allume, `g` s'éteint : 2), `5` devient `0` (`b` et `e` s'allument, `g` s'éteint : 3), `9` devient `0` (2). Cela fait 11, puis de `10:00` à `10:01`, le dernier chiffre passe de `0` à `1` : 4 de plus, soit 15.

Les pièges :
- un chiffre qui ne change pas ne fait basculer aucun segment, et `bascules(x, x)` doit bien renvoyer 0 ;
- un segment allumé dans les deux chiffres (comme `b` et `c` entre `0` et `1`) ne bascule pas ;
- quand les deux heures sont égales, la réponse est 0 : l'horloge ne fait pas un tour complet.

Une question fait au plus 1 439 pas, chacun avec quatre appels à `bascules` : c'est très rapide.
