import json, random
random.seed(2049)

def arbre_hasard(n):
    # fils gauche et droit de chaque nœud, racine 1 (avant renumérotation)
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

def texte(n, g, d, melanger=True):
    p = list(range(1, n + 1))
    if melanger:
        random.shuffle(p)
    nom = [0] + p
    G = [0] * (n + 1)
    D = [0] * (n + 1)
    for v in range(1, n + 1):
        G[nom[v]] = nom[g[v]]
        D[nom[v]] = nom[d[v]]
    return f"{n}\n" + "".join(f"{G[v]} {D[v]}\n" for v in range(1, n + 1))

tests = []
tests.append("5\n2 3\n4 5\n0 0\n0 0\n0 0\n")
tests.append("4\n0 0\n4 1\n0 0\n3 0\n")
tests.append("1\n0 0\n")
n = 1000
tests.append(texte(n, [0] + [i + 1 if i < n else 0 for i in range(1, n + 1)], [0] * (n + 1)))   # chemin à gauche
tests.append(texte(n, [0] * (n + 1), [0] + [i + 1 if i < n else 0 for i in range(1, n + 1)]))   # chemin à droite
n = 1000
tests.append(texte(n, [0] + [2 * i if 2 * i <= n else 0 for i in range(1, n + 1)], [0] + [2 * i + 1 if 2 * i + 1 <= n else 0 for i in range(1, n + 1)], False))
for n in [7, 30, 1000, 1000]:
    g, d = arbre_hasard(n)
    tests.append(texte(n, g, d))
# zigzag
n = 999
g = [0] * (n + 1)
d = [0] * (n + 1)
for i in range(1, n):
    if i % 2:
        g[i] = i + 1
    else:
        d[i] = i + 1
tests.append(texte(n, g, d))
print(json.dumps(tests))
