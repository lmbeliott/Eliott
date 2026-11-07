import json, random
random.seed(4304)


def texte(n, budget, routes):
    return f"{n} {len(routes)} {budget}\n" + "".join(f"{a} {b} {l} {t}\n" for a, b, l, t in routes)


def alea(n, m, lmax, tmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(1, lmax), random.randint(1, tmax)) for _ in range(m)]


tests = []
tests.append(texte(4, 11, [(1, 2, 3, 5), (2, 4, 3, 5), (1, 3, 2, 1), (3, 4, 9, 2), (1, 4, 20, 1)]))
tests.append(texte(3, 5, [(1, 2, 3, 1), (2, 3, 3, 1)]))
tests.append(texte(1, 1, []))
tests.append(texte(2, 100, []))
tests.append(texte(2, 7, [(1, 2, 7, 4), (1, 2, 8, 1), (2, 2, 1, 1)]))
for n, m in [(6, 10), (12, 25), (40, 80), (200, 400)]:
    tests.append(texte(n, random.randint(10, 60), alea(n, m, 20, 50)))
# grands
import heapq


def plus_court(n, routes):
    vois = [[] for _ in range(n + 1)]
    for a, b, l, t in routes:
        vois[a].append((b, l))
        vois[b].append((a, l))
    dist = [None] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        for v, l in vois[u]:
            if dist[v] is None or d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (d + l, v))
    return dist[n]


# une seule chaîne de 1 à N, plus des raccourcis longs et chers
n = 5000
routes = [(i, i + 1, 100, random.randint(1, 1000)) for i in range(1, n)]
routes += [(random.randint(1, n), random.randint(1, n), random.randint(10 ** 5, 10 ** 6), random.randint(500, 10 ** 6)) for _ in range(1000)]
random.shuffle(routes)
tests.append(texte(n, 600000, routes))
for n, m, lmax, tmax, facteur in [(2000, 6000, 1000, 10 ** 6, 1.5), (5000, 6000, 10 ** 6, 5000, 2)]:
    while True:
        routes = alea(n, m, lmax, tmax)
        d = plus_court(n, routes)
        if d is not None:
            break
    tests.append(texte(n, int(d * facteur), routes))
print(json.dumps(tests))
