import json, random, heapq
random.seed(4102)


def nb_plus_courts(n, aretes):
    # nombre de plus courts chemins de 1 à N (plafonné à 2), ou 0 si N est inaccessible
    succ = [[] for _ in range(n + 1)]
    for a, b, l in aretes:
        succ[a].append((b, l))
    dist = [None] * (n + 1)
    nb = [0] * (n + 1)
    dist[1], nb[1] = 0, 1
    tas = [(0, 1)]
    fait = [False] * (n + 1)
    while tas:
        d, u = heapq.heappop(tas)
        if fait[u]:
            continue
        fait[u] = True
        for v, l in succ[u]:
            if dist[v] is None or d + l < dist[v]:
                dist[v], nb[v] = d + l, nb[u]
                heapq.heappush(tas, (d + l, v))
            elif d + l == dist[v]:
                nb[v] = min(2, nb[v] + nb[u])
    return nb[n]


def texte(n, aretes):
    assert nb_plus_courts(n, aretes) <= 1
    return f"{n} {len(aretes)}\n" + "".join(f"{a} {b} {l}\n" for a, b, l in aretes)


def unique(n, fabrique):
    while True:
        ar = fabrique()
        if nb_plus_courts(n, ar) <= 1:
            return ar


tests = []
tests.append(texte(6, [(1, 2, 7), (1, 3, 2), (3, 2, 3), (2, 4, 4), (3, 5, 9), (4, 6, 2), (5, 6, 1), (6, 1, 1)]))
tests.append(texte(3, [(1, 2, 5), (3, 2, 1)]))
tests.append(texte(1, []))
tests.append(texte(2, [(2, 1, 3)]))
tests.append(texte(2, [(1, 2, 9), (1, 2, 4), (1, 1, 1)]))
for n, m, lmax in [(6, 12, 30), (10, 25, 100), (30, 80, 1000), (80, 200, 10 ** 6)]:
    tests.append(texte(n, unique(n, lambda: [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax)) for _ in range(m)])))
# chemin très long : une chaîne mélangée et des raccourcis plus chers
n = 5000
perm = [1] + random.sample(range(2, n), n - 2) + [n]
ar = [(perm[i], perm[i + 1], random.randint(1, 1000)) for i in range(n - 1)]
for _ in range(1500):
    i = random.randint(0, n - 3)
    j = random.randint(i + 2, min(n - 1, i + 40))
    ar.append((perm[i], perm[j], 1000 * (j - i) + random.randint(1, 1000)))
random.shuffle(ar)
tests.append(texte(n, ar))
# grands graphes aléatoires
for n, m in [(5000, 7000), (2000, 7000)]:
    tests.append(texte(n, unique(n, lambda: [(random.randint(1, n), random.randint(1, n), random.randint(1, 10 ** 6)) for _ in range(m)])))
# N inaccessible dans un grand graphe : N n'a que des arêtes sortantes
n = 4000
ar = [(random.randint(1, n - 1), random.randint(1, n - 1), random.randint(1, 10 ** 6)) for _ in range(3000)]
ar += [(n, random.randint(1, n - 1), 5) for _ in range(20)]
tests.append(texte(n, ar))
print(json.dumps(tests))
