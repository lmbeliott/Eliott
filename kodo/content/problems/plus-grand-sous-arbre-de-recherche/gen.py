import json, random
random.seed(2055)

def abr(cles):
    # arbre binaire de recherche obtenu en insérant les clés dans l'ordre (nœud i = i-ième clé)
    n = len(cles)
    g = [0] * (n + 1)
    d = [0] * (n + 1)
    for i in range(2, n + 1):
        v = 1
        while True:
            if cles[i - 1] < cles[v - 1]:
                if g[v] == 0:
                    g[v] = i
                    break
                v = g[v]
            else:
                if d[v] == 0:
                    d[v] = i
                    break
                v = d[v]
    return [0] + list(cles), g, d

def texte(k, g, d):
    n = len(k) - 1
    p = list(range(1, n + 1))
    random.shuffle(p)
    nom = [0] + p
    K = [0] * (n + 1)
    G = [0] * (n + 1)
    D = [0] * (n + 1)
    for v in range(1, n + 1):
        K[nom[v]] = k[v]
        G[nom[v]] = nom[g[v]]
        D[nom[v]] = nom[d[v]]
    return f"{n}\n" + "".join(f"{K[v]} {G[v]} {D[v]}\n" for v in range(1, n + 1))

def equilibre(cles):
    # ordre d'insertion qui donne un arbre équilibré
    res = []
    def rec(a, b):
        if a > b:
            return
        m = (a + b) // 2
        res.append(cles[m])
        rec(a, m - 1)
        rec(m + 1, b)
    rec(0, len(cles) - 1)
    return res

def greffe(k, g, d, k2, g2, d2, ou, cote):
    # accroche l'arbre 2 sous le nœud ou (côté 0 : gauche, 1 : droite) de l'arbre 1
    n1 = len(k) - 1
    k = k + k2[1:]
    g = g + [x + n1 if x else 0 for x in g2[1:]]
    d = d + [x + n1 if x else 0 for x in d2[1:]]
    if cote == 0:
        g[ou] = n1 + 1
    else:
        d[ou] = n1 + 1
    return k, g, d

def feuille_libre(g, d):
    return random.choice([v for v in range(1, len(g)) if g[v] == 0 or d[v] == 0])

tests = []
tests.append("5\n10 2 3\n5 4 5\n15 0 0\n1 0 0\n8 0 0\n")
tests.append("6\n10 2 3\n5 4 5\n15 6 0\n1 0 0\n12 0 0\n20 0 0\n")
tests.append("1\n7 0 0\n")
tests.append("2\n7 2 0\n7 0 0\n")
# un grand ABR entier
tests.append(texte(*abr(random.sample(range(-10 ** 9, 10 ** 9), 3000))))
# arbre quelconque : clés au hasard
k, g, d = abr(random.sample(range(1, 10 ** 6), 3000))
k = [0] + [random.randint(1, 10 ** 6) for _ in range(3000)]
tests.append(texte(k, g, d))
# un ABR de 1 500 nœuds greffé sous une feuille d'un arbre quelconque de 1 000 nœuds
k1, g1, d1 = abr(random.sample(range(1, 10 ** 6), 1000))
k1 = [0] + [random.randint(1, 10 ** 6) for _ in range(1000)]
k2, g2, d2 = abr(random.sample(range(1, 10 ** 6), 1500))
v = feuille_libre(g1, d1)
tests.append(texte(*greffe(k1, g1, d1, k2, g2, d2, v, 0 if g1[v] == 0 else 1)))
# un long chemin ABR, dont la racine casse la propriété
k, g, d = abr(list(range(1, 5001)))
k[1] = 6000
tests.append(texte(k, g, d))
# un long chemin vers la gauche, cassé près du bas : test séparé de chaque sous-arbre trop lent
k, g, d = abr(list(range(5000, 0, -1)))
k[4990] = 10 ** 6
tests.append(texte(k, g, d))
# ABR équilibré dont une clé profonde est modifiée
k, g, d = abr(equilibre(list(range(1, 2048))))
k[2000] = 10 ** 6
tests.append(texte(k, g, d))
for n in [8, 40, 200]:
    k, g, d = abr(random.sample(range(1, 60), min(n, 59)) if n < 60 else random.sample(range(1, 10 ** 4), n))
    for _ in range(max(1, n // 20)):
        k[random.randint(1, len(k) - 1)] = random.randint(1, 10 ** 4)
    tests.append(texte(k, g, d))
print(json.dumps(tests))
