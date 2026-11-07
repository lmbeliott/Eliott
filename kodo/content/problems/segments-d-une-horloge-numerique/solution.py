# Segments allumés pour chaque chiffre, de 0 à 9.
SEGMENTS = ["abcdef", "bc", "abdeg", "abcdg", "bcfg",
            "acdfg", "acdefg", "abc", "abcdefg", "abcdfg"]


def en_minutes(horaire):
    # "09:59" -> 9 * 60 + 59
    return int(horaire[0:2]) * 60 + int(horaire[3:5])


def chiffres(t):
    # Les quatre chiffres affichés à la minute t.
    h = t // 60
    m = t % 60
    return [h // 10, h % 10, m // 10, m % 10]


def bascules(x, y):
    # Nombre de segments allumés dans un seul des deux chiffres.
    n = 0
    for s in "abcdefg":
        if (s in SEGMENTS[x]) != (s in SEGMENTS[y]):
            n += 1
    return n


def transition(t):
    # Bascules entre la minute t et la minute suivante.
    avant = chiffres(t)
    apres = chiffres((t + 1) % 1440)
    total = 0
    for i in range(4):
        total += bascules(avant[i], apres[i])
    return total


q = int(input())
for _ in range(q):
    depart, arrivee = input().split()
    t = en_minutes(depart)
    fin = en_minutes(arrivee)
    total = 0
    while t != fin:
        total += transition(t)
        t = (t + 1) % 1440
    print(total)
