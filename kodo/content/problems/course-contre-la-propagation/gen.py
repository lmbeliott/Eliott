import json, random
random.seed(2026)

# Symboles : '.' libre, '#' mur, '*' source de contamination, 'X' sortie, '@' départ du pion.


def fmt(grille):
    return f"{len(grille)} {len(grille[0])}\n" + "".join("".join(ligne) + "\n" for ligne in grille)


def poser(grille, ch, nb, zone=None):
    # Pose nb fois le caractère ch sur des cases libres, dans la zone (i0, i1, j0, j1) si donnée.
    r, c = len(grille), len(grille[0])
    i0, i1, j0, j1 = zone if zone else (0, r - 1, 0, c - 1)
    while nb > 0:
        i, j = random.randint(i0, i1), random.randint(j0, j1)
        if grille[i][j] == ".":
            grille[i][j] = ch
            nb -= 1


def aleatoire(r, c, p_mur):
    return [["#" if random.random() < p_mur else "." for _ in range(c)] for _ in range(r)]


def serpentin(r, c):
    # Long couloir en zigzag : lignes paires libres, lignes impaires murées sauf une ouverture.
    grille = []
    for i in range(r):
        if i % 2 == 0:
            grille.append(["."] * c)
        else:
            ligne = ["#"] * c
            ligne[c - 1 if i % 4 == 1 else 0] = "."
            grille.append(ligne)
    return grille


def course_serree(r, c, a, b):
    # Couloir en zigzag de période 4 ; le pion part de (0, 0). Un boyau (ligne 2, colonnes b à a)
    # contaminé depuis (2, b) débouche dans le couloir en (0, a) par l'ouverture (1, a).
    grille = [["#"] * c for _ in range(r)]
    for i in range(0, r, 4):
        grille[i] = ["."] * c
        if i + 4 < r:
            col = c - 1 if i % 8 == 0 else 0
            for k in range(1, 4):
                grille[i + k][col] = "."
    for j in range(b, a + 1):
        grille[2][j] = "."
    grille[1][a] = "."
    grille[2][b] = "*"
    grille[0][0] = "@"
    grille[r - 4][c - 1 if (r - 4) % 8 == 0 else 0] = "X"
    return grille


def deux_voies():
    # Ligne 0 : chemin direct vers la sortie (0, 299), coupé par une source en (0, 150).
    # Lignes 2 à 298 : couloir en zigzag (colonnes 0 à 297), puis retour par la colonne 299.
    r = c = 300
    grille = [["#"] * c for _ in range(r)]
    grille[0] = ["."] * c
    grille[0][0] = "@"
    grille[0][150] = "*"
    grille[0][299] = "X"
    grille[1][0] = "."
    for i in range(2, 299, 2):
        for j in range(298):
            grille[i][j] = "."
        if i + 2 < 299:
            grille[i + 1][297 if i % 4 == 2 else 0] = "."
    grille[298][298] = "."
    for i in range(1, 299):
        grille[i][299] = "."
    return grille


tests = [
    fmt(["..X...", "*#.#..", ".@#..#", "......"]),
    fmt(["@..X", "##.#", "##*#"]),
]
tests.append(fmt(["@.*", ".#.", "..X"]))
# Cas limites : sortie juste à côté, égalité de minute avec la contamination, aucune source.
tests.append(fmt(["@X"]))
tests.append(fmt(["@.X", "#*#"]))
tests.append(fmt(["@.X", "#.#", "#*#"]))
tests.append(fmt(["@#X"]))
tests.append(fmt(["@....", "####.", "X...."]))
# Les sorties arrêtent la contamination : ce mur de sorties protège le pion.
tests.append(fmt(["*.X..", "..X..", "..X.@"]))
# Pion cerné : toutes ses voisines sont contaminées dès la minute 1.
tests.append(fmt([".*.", "*@*", ".*.", "..X"]))
# Petit cas aléatoire.
grille = aleatoire(10, 12, 0.25)
poser(grille, "@", 1)
poser(grille, "X", 2)
poser(grille, "*", 2)
tests.append(fmt(grille))

# Course-poursuite dans un long couloir : la contamination part juste derrière le pion.
grille = serpentin(300, 300)
grille[0][0] = "*"
grille[0][1] = "@"
grille[299][299] = "X"
tests.append(fmt(grille))
# Course serrée : la contamination sort d'un boyau et atteint le couloir juste après le pion
# (b = 1), ou exactement en même temps que lui (b = 2, réponse -1).
for b in (1, 2):
    grille = course_serree(60, 100, 60, b)
    tests.append(fmt(grille))
# Deux voies : le chemin direct (ligne du haut) est contaminé, le pion doit faire le long détour.
tests.append(fmt(deux_voies()))
# Grandes grilles aléatoires : la contamination part du coin, le pion un peu plus loin,
# les sorties au fond.
for p_mur, nb_sources, zone_depart in [(0.35, 4, (10, 12, 10, 12)), (0.3, 3, (25, 30, 25, 30))]:
    grille = aleatoire(300, 300, p_mur)
    poser(grille, "*", nb_sources, (0, 6, 0, 6))
    poser(grille, "@", 1, zone_depart)
    poser(grille, "X", 3, (200, 299, 200, 299))
    tests.append(fmt(grille))
# Grille sans contamination.
grille = aleatoire(100, 100, 0.33)
poser(grille, "@", 1)
poser(grille, "X", 1)
tests.append(fmt(grille))
print(json.dumps(tests))
