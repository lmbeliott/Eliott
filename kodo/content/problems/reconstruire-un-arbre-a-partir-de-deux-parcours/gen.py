import json, random, sys
random.seed(2053)
sys.setrecursionlimit(10000)

def arbre_hasard(n):
    g = [0] * (n + 1)
    d = [0] * (n + 1)
    libres = [(1, 0), (1, 1)]
    for v in range(2, n + 1):
        k = random.randrange(len(libres))
        p, cote = libres[k]
        libres[k] = libres[-1]
        libres.pop()
        if cote == 0:
            g[p] = v
        else:
            d[p] = v
        libres += [(v, 0), (v, 1)]
    return g, d

def parcours(n, g, d):
    nom = list(range(1, n + 1))
    random.shuffle(nom)
    nom = [0] + nom
    pre, ino = [], []
    def rec(v):
        if v:
            pre.append(nom[v])
            rec(g[v])
            ino.append(nom[v])
            rec(d[v])
    rec(1)
    return pre, ino

def test(pre, ino):
    return f"{len(pre)}\n{' '.join(map(str, pre))}\n{' '.join(map(str, ino))}\n"

tests = []
tests.append(test([1, 2, 4, 5, 3], [4, 2, 5, 1, 3]))
tests.append(test([1, 2, 3], [3, 1, 2]))
tests.append(test([3, 1, 2], [1, 2, 3]))
tests.append(test([1], [1]))
n = 1000
pre, ino = parcours(n, [0] + [i + 1 if i < n else 0 for i in range(1, n + 1)], [0] * (n + 1))
tests.append(test(pre, ino))
for n in [10, 1000, 1000]:
    tests.append(test(*parcours(n, *arbre_hasard(n))))
pre, ino = parcours(1000, *arbre_hasard(1000))
ino[400], ino[401] = ino[401], ino[400]            # deux nœuds voisins échangés
tests.append(test(pre, ino))
pre, ino = parcours(1000, *arbre_hasard(1000))
random.shuffle(ino)                                 # deux ordres sans rapport
tests.append(test(pre, ino))
n = 999
g = [0] * (n + 1)
d = [0] * (n + 1)
for i in range(1, n):
    if i % 2:
        g[i] = i + 1
    else:
        d[i] = i + 1
tests.append(test(*parcours(n, g, d)))
pre, ino = parcours(8, *arbre_hasard(8))
pre[0], pre[-1] = pre[-1], pre[0]
tests.append(test(pre, ino))
print(json.dumps(tests))
