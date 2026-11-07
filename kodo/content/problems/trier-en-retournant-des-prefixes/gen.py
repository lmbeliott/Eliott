import json, random
from itertools import permutations
random.seed(2039)

def test(n, perms):
    return f"{n} {len(perms)}\n" + "\n".join(" ".join(map(str, p)) for p in perms) + "\n"

def hasard(n, q):
    res = []
    for _ in range(q):
        p = list(range(1, n + 1))
        random.shuffle(p)
        res.append(p)
    return res

def les_plus_longs(n):
    # permutations les plus éloignées de la liste triée (calculées ici par un parcours)
    depart = tuple(range(1, n + 1))
    dist = {depart: 0}
    couche = [depart]
    while True:
        suivante = []
        for p in couche:
            for k in range(2, n + 1):
                t = p[:k][::-1] + p[k:]
                if t not in dist:
                    dist[t] = dist[p] + 1
                    suivante.append(t)
        if not suivante:
            return sorted(list(x) for x in couche)
        couche = suivante

tests = []
tests.append(test(4, [[2, 1, 3, 4], [3, 1, 2, 4], [4, 3, 2, 1], [1, 2, 3, 4], [2, 4, 1, 3]]))
tests.append(test(3, [list(p) for p in permutations(range(1, 4))]))
tests.append(test(1, [[1]]))
tests.append(test(2, [[2, 1], [1, 2]]))
tests.append(test(8, [[1, 2, 3, 4, 5, 6, 7, 8], [8, 7, 6, 5, 4, 3, 2, 1], [2, 1, 4, 3, 6, 5, 8, 7], [1, 3, 5, 7, 2, 4, 6, 8]]))
tests.append(test(8, hasard(8, 1000)))
tests.append(test(8, hasard(8, 1000)))
tests.append(test(7, hasard(7, 800)))
tests.append(test(6, [list(p) for p in permutations(range(1, 7))]))
tests.append(test(5, hasard(5, 50)))
tests.append(test(8, les_plus_longs(8) + hasard(8, 20)))
tests.append(test(7, les_plus_longs(7)))
print(json.dumps(tests))
