import json, random
random.seed(2026)


def fmt(grille):
    return f"{len(grille)} {len(grille[0])}\n" + "".join(ligne + "\n" for ligne in grille)


def aleatoire(r, c, p_interdite, chiffres="0123456789"):
    return ["".join("#" if random.random() < p_interdite else random.choice(chiffres) for _ in range(c))
            for _ in range(r)]


tests = [
    fmt(["3#120", "032#3", "32313", "22#1#"]),
    fmt(["12#3", "#4##", "###5"]),
]
tests.append(fmt(["123", "#4#", "##5"]))
tests.append(fmt(["7"]))
tests.append(fmt(["#"]))
tests.append(fmt(["5#95#9"]))
tests.append(fmt(["1", "2", "3", "4"]))
tests.append(fmt(["9", "#", "9"]))
tests.append(fmt(["00", "00", "00"]))
tests.append(fmt(aleatoire(6, 7, 0.2, "0123")))
tests.append(fmt(aleatoire(30, 25, 0.3)))
# Toutes les cases à 0 : tous les chemins ont la même valeur, il faut tous les compter.
tests.append(fmt(["0" * 200] * 60))
# Grands cas.
tests.append(fmt(aleatoire(300, 300, 0.1)))
tests.append(fmt(aleatoire(300, 300, 0.35, "0123")))
# Peu de valeurs distinctes : beaucoup d'égalités entre chemins.
tests.append(fmt(aleatoire(300, 300, 0.15, "11112")))
# Une ligne entièrement interdite au milieu : aucun chemin.
grille = aleatoire(300, 280, 0.05)
grille[150] = "#" * 280
tests.append(fmt(grille))
print(json.dumps(tests))
