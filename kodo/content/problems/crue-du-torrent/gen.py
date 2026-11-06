import json, random
random.seed(2026)


def fmt(carte):
    return f"{len(carte)} {len(carte[0])}\n" + "".join("".join(ligne) + "\n" for ligne in carte)


def vide(r, c, ch="."):
    return [[ch] * c for _ in range(r)]


def poser(carte, ch, nb, zone=None):
    # Pose nb fois le caractère ch sur des cases libres, dans la zone (i0, i1, j0, j1) si donnée.
    r, c = len(carte), len(carte[0])
    i0, i1, j0, j1 = zone if zone else (0, r - 1, 0, c - 1)
    while nb > 0:
        i, j = random.randint(i0, i1), random.randint(j0, j1)
        if carte[i][j] == ".":
            carte[i][j] = ch
            nb -= 1


def aleatoire(r, c, p_rocher):
    return [["#" if random.random() < p_rocher else "." for _ in range(c)] for _ in range(r)]


def serpentin(r, c):
    # Long couloir en zigzag : lignes paires libres, lignes impaires murées sauf une ouverture.
    carte = []
    for i in range(r):
        if i % 2 == 0:
            carte.append(["."] * c)
        else:
            ligne = ["#"] * c
            ligne[c - 1 if i % 4 == 1 else 0] = "."
            carte.append(ligne)
    return carte


def course_serree(r, c, a, b):
    # Couloir en zigzag de période 4 ; Théo part de (0, 0). Un boyau (ligne 2, colonnes b à a)
    # rempli d'eau depuis (2, b) débouche dans le couloir en (0, a) par l'ouverture (1, a).
    carte = [["#"] * c for _ in range(r)]
    for i in range(0, r, 4):
        carte[i] = ["."] * c
        if i + 4 < r:
            col = c - 1 if i % 8 == 0 else 0
            for k in range(1, 4):
                carte[i + k][col] = "."
    for j in range(b, a + 1):
        carte[2][j] = "."
    carte[1][a] = "."
    carte[2][b] = "E"
    carte[0][0] = "T"
    carte[r - 4][c - 1 if (r - 4) % 8 == 0 else 0] = "R"
    return carte


def deux_voies():
    # Ligne 0 : chemin direct vers le refuge (0, 299), coupé par une source en (0, 150).
    # Lignes 2 à 298 : couloir en zigzag (colonnes 0 à 297), puis retour par la colonne 299.
    r = c = 300
    carte = [["#"] * c for _ in range(r)]
    carte[0] = ["."] * c
    carte[0][0] = "T"
    carte[0][150] = "E"
    carte[0][299] = "R"
    carte[1][0] = "."
    for i in range(2, 299, 2):
        for j in range(298):
            carte[i][j] = "."
        if i + 2 < 299:
            carte[i + 1][297 if i % 4 == 2 else 0] = "."
    carte[298][298] = "."
    for i in range(1, 299):
        carte[i][299] = "."
    return carte


tests = [
    fmt(["..R...", "E#.#..", ".T#..#", "......"]),
    fmt(["T..R", "##.#", "##E#"]),
]
tests.append(fmt(["T.E", ".#.", "..R"]))
# Cas limites : refuge juste à côté, égalité de minute avec l'eau, aucune source d'eau.
tests.append(fmt(["TR"]))
tests.append(fmt(["T.R", "#E#"]))
tests.append(fmt(["T.R", "#.#", "#E#"]))
tests.append(fmt(["T#R"]))
tests.append(fmt(["T....", "####.", "R...."]))
# Les refuges arrêtent l'eau : ce mur de refuges protège Théo.
tests.append(fmt(["E.R..", "..R..", "..R.T"]))
# Théo cerné : toutes ses voisines sont inondées dès la minute 1.
tests.append(fmt([".E.", "ETE", ".E.", "..R"]))
# Petit cas aléatoire.
carte = aleatoire(10, 12, 0.25)
poser(carte, "T", 1)
poser(carte, "R", 2)
poser(carte, "E", 2)
tests.append(fmt(carte))

# Course-poursuite dans un long couloir : l'eau part juste derrière Théo.
carte = serpentin(300, 300)
carte[0][0] = "E"
carte[0][1] = "T"
carte[299][299] = "R"
tests.append(fmt(carte))
# Course serrée : l'eau sort d'un boyau et atteint le couloir juste après Théo (b = 1),
# ou exactement en même temps que lui (b = 2, réponse -1).
for b in (1, 2):
    carte = course_serree(60, 100, 60, b)
    tests.append(fmt(carte))
# Deux voies : le chemin direct (ligne du haut) est inondé, Théo doit faire le long détour.
tests.append(fmt(deux_voies()))
# Grands vallons aléatoires : l'eau part du coin, Théo un peu plus loin, refuges au fond.
for p_rocher, nb_eau, zone_theo in [(0.35, 4, (10, 12, 10, 12)), (0.3, 3, (25, 30, 25, 30))]:
    carte = aleatoire(300, 300, p_rocher)
    poser(carte, "E", nb_eau, (0, 6, 0, 6))
    poser(carte, "T", 1, zone_theo)
    poser(carte, "R", 3, (200, 299, 200, 299))
    tests.append(fmt(carte))
# Vallon sans eau.
carte = aleatoire(100, 100, 0.33)
poser(carte, "T", 1)
poser(carte, "R", 1)
tests.append(fmt(carte))
print(json.dumps(tests))
