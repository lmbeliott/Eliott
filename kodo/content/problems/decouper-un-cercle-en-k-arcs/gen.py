import json, random
random.seed(2026)

def test(k, a):
    return f"{len(a)} {k}\n" + " ".join(map(str, a)) + "\n"

def aleatoire(n, lo=1, hi=10000):
    return [random.randint(lo, hi) for _ in range(n)]

def tourner(a):
    # place un point de coupe intéressant loin de la case 1
    i = random.randrange(len(a))
    return a[i:] + a[:i]

def debut_leger(n, legers):
    # beaucoup de petites cases autour de la case 1, puis des grosses : l'arc
    # glouton qui part de la case 1 est très long
    return [random.randint(1, 3) for _ in range(legers)] + aleatoire(n - legers, 9000, 10000)

def blocs(n, taille):
    # des blocs lourds séparés par des cases légères : il faut bien choisir où couper
    a = []
    while len(a) < n:
        a += aleatoire(taille, 7000, 10000) + aleatoire(random.randint(1, 3), 1, 50)
    return tourner(a[:n])

tests = [
    test(3, [5, 1, 3, 8, 9, 3, 6]),
    test(2, [9, 8, 2, 3, 4]),
    test(1, [42]),
    test(1, [4, 7, 1, 9]),                  # un seul arc : tout le cercle
    test(5, [3, 1, 4, 1, 5]),               # K = N : chaque case seule
    test(4, [6] * 10),
    test(2, [1, 10000, 1, 1, 10000, 1]),
    test(3, [10000, 1, 1, 1, 1, 1, 1, 1, 10000, 9999]),
    test(3, aleatoire(12, 1, 20)),
    test(7, blocs(60, 4)),
    test(40, aleatoire(500)),
    test(333, blocs(2000, 5)),
    test(1200, debut_leger(4000, 1500)),
]
# tailles maximales : K grand, pour que les essais de tous les débuts soient trop lents
tests.append(test(5000, blocs(15000, 2)))
tests.append(test(4999, debut_leger(15000, 6000)))
tests.append(test(7000, tourner(aleatoire(15000))))
tests.append(test(12, aleatoire(15000)))
print(json.dumps(tests))
