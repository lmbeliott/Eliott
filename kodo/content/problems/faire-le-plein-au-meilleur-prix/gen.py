import json, random
random.seed(2026)

def test(longueur, capacite, stations):
    return f"{len(stations)} {longueur} {capacite}\n" + "".join(f"{x} {p}\n" for x, p in stations)

def route(n, ecart_max):
    # n positions strictement croissantes depuis 0, puis l'arrivée,
    # sans écart plus grand que ecart_max
    xs = [0]
    while len(xs) < n:
        xs.append(xs[-1] + random.randint(1, ecart_max))
    return xs, xs[-1] + random.randint(1, ecart_max)

def aleatoire(n, capacite, ecart_max, pmax=1000):
    xs, longueur = route(n, ecart_max)
    return test(longueur, capacite, [(x, random.randint(1, pmax)) for x in xs])

def croissants(n, ecart_max):
    # prix croissants le long de la route, réservoir d'une demi-route : chercher la
    # prochaine station moins chère parmi toutes celles à portée coûte O(N²)
    xs, longueur = route(n, ecart_max)
    capacite = longueur // 2
    prix = sorted(random.randint(1, 1000) for _ in range(n))
    return test(longueur, capacite, list(zip(xs, prix)))

def croissants_avec_egalites(n, ecart_max):
    # prix croissants avec beaucoup d'égalités, réservoir d'un tiers de route
    xs, longueur = route(n, ecart_max)
    prix = sorted(random.randint(1, 60) for _ in range(n))
    return test(longueur, longueur // 3, list(zip(xs, prix)))

def dents_de_scie(n, capacite, ecart_max):
    # des stations bon marché de temps en temps, chères entre les deux
    xs, longueur = route(n, ecart_max)
    return test(longueur, capacite,
                [(x, random.randint(1, 50) if i % 7 == 0 else random.randint(500, 1000))
                 for i, x in enumerate(xs)])

tests = [
    test(10, 6, [(0, 5), (3, 2), (5, 4), (8, 3)]),
    test(10, 4, [(0, 1), (3, 1), (8, 1)]),
    test(7, 7, [(0, 3)]),                        # une seule station, juste assez
    test(8, 7, [(0, 3)]),                        # réservoir trop petit : -1
    test(12, 4, [(0, 9), (4, 9), (8, 9)]),       # écarts égaux à la capacité
    test(20, 5, [(0, 9), (4, 7), (8, 5), (12, 3), (16, 1)]),   # de moins en moins cher
    test(20, 20, [(0, 1), (4, 3), (8, 5), (12, 7), (16, 9)]),  # tout acheter au départ
    test(15, 6, [(0, 2), (5, 9), (6, 1), (10, 8)]),
    test(1000000000, 1000000000, [(0, 1000)]),   # coût de 10¹² : il faut des long long
    test(30, 10, [(0, 4), (9, 6), (11, 2), (20, 7), (25, 3)]),
    test(50, 9, [(0, 1), (9, 5), (20, 1), (25, 2), (40, 1)]),  # un écart trop grand au milieu
    aleatoire(10, 12, 6, 20),
    aleatoire(100, 200, 80),
    dents_de_scie(500, 20000, 4000),
    aleatoire(2000, 2 * 10**6, 5 * 10**5),
    dents_de_scie(2000, 4 * 10**5, 10**5),
]
# tailles maximales
tests.append(croissants(10000, 10**5))
tests.append(croissants_avec_egalites(10000, 10**5))
print(json.dumps(tests))
