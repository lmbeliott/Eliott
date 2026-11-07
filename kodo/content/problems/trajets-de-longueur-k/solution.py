def produit(x, y):
    # Nouvelle grille z avec z[i][j] = somme des x[i][p] * y[p][j].
    n = len(x)
    z = []
    for i in range(n):
        z.append([0] * n)
    for i in range(n):
        for j in range(n):
            s = 0
            for p in range(n):
                s = s + x[i][p] * y[p][j]
            z[i][j] = s
    return z


n, k = map(int, input().split())
a = []
for i in range(n):
    a.append(list(map(int, input().split())))

c = a                       # trajets de longueur 1
for etape in range(k - 1):
    c = produit(c, a)       # on allonge les trajets d'une route

for i in range(n):
    print(" ".join(map(str, c[i])))
