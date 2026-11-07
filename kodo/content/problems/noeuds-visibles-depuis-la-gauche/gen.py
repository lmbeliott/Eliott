import json, random
random.seed(2050)

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
tests.append("6\n2 3\n0 4\n0 0\n0 5\n6 0\n0 0\n")
tests.append("5\n0 2\n0 0\n1 4\n0 0\n0 0\n")
tests.append("1\n0 0\n")
n = 5000
tests.append(texte(n, [0] * (n + 1), [0] + [i + 1 if i < n else 0 for i in range(1, n + 1)]))   # chemin à droite
n = 4095
tests.append(texte(n, [0] + [2 * i if 2 * i <= n else 0 for i in range(1, n + 1)], [0] + [2 * i + 1 if 2 * i + 1 <= n else 0 for i in range(1, n + 1)]))
for n in [8, 40, 10000, 10000]:
    g, d = arbre_hasard(n)
    tests.append(texte(n, g, d))
# zigzag : chaque niveau n'a qu'un nœud, alternativement fils gauche et fils droit
n = 3000
g = [0] * (n + 1)
d = [0] * (n + 1)
for i in range(1, n):
    if i % 2:
        g[i] = i + 1
    else:
        d[i] = i + 1
tests.append(texte(n, g, d))
# un peigne : une longue branche gauche, et une branche droite plus longue
n = 3000
g = [0] * (n + 1)
d = [0] * (n + 1)
for i in range(2, 1001):
    g[i - 1 if i > 2 else 1] = i
d[1] = 1001
for i in range(1002, n + 1):
    d[i - 1] = i
tests.append(texte(n, g, d))
print(json.dumps(tests))
