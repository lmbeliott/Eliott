import json, random
random.seed(2052)

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

tests = []
tests.append("5\n8 2 3\n3 4 5\n10 0 0\n1 0 0\n6 0 0\n")
tests.append("3\n7 2 3\n7 0 0\n9 0 0\n")             # deux clés égales
tests.append("3\n5 2 0\n3 0 3\n6 0 0\n")             # le piège : 6 est à gauche de 5
tests.append("1\n-1000000000 0 0\n")
cles = random.sample(range(-10 ** 9, 10 ** 9), 3500)
tests.append(texte(*abr(cles)))
k, g, d = abr(cles)
k[random.randint(2, 3500)] = random.randint(-10 ** 9, 10 ** 9)   # une clé changée au hasard
tests.append(texte(k, g, d))
k, g, d = abr(sorted(random.sample(range(-10 ** 9, 10 ** 9), 3500)))   # chemin vers la droite
tests.append(texte(k, g, d))
k[3500] = k[2] + 1                                                    # tout au fond, une clé trop petite
tests.append(texte(k, g, d))
k, g, d = abr(equilibre(list(range(1, 2048))))
tests.append(texte(k, g, d))
k[2047] = k[1] + 1          # une feuille reçoit la clé qui suit celle de la racine
tests.append(texte(k, g, d))
k, g, d = abr(equilibre(list(range(1, 2048))))
k[2], k[3] = k[3], k[2]
tests.append(texte(k, g, d))
# deux clés égales
k, g, d = abr(random.sample(range(1, 100), 50))
v = random.randint(2, 50)
k[v] = k[1]
tests.append(texte(k, g, d))
print(json.dumps(tests))
