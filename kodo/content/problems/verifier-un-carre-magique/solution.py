def valeurs_correctes(g, n):
    # Chaque entier de 1 à n*n apparaît exactement une fois.
    vu = [False] * (n * n + 1)
    for i in range(n):
        for j in range(n):
            v = g[i][j]
            if vu[v]:
                return False
            vu[v] = True
    return True


def sommes_egales(g, n):
    reference = 0
    for j in range(n):
        reference = reference + g[0][j]
    for i in range(n):              # lignes
        s = 0
        for j in range(n):
            s = s + g[i][j]
        if s != reference:
            return False
    for j in range(n):              # colonnes
        s = 0
        for i in range(n):
            s = s + g[i][j]
        if s != reference:
            return False
    d1 = 0
    d2 = 0
    for i in range(n):              # diagonales
        d1 = d1 + g[i][i]
        d2 = d2 + g[i][n - 1 - i]
    return d1 == reference and d2 == reference


n = int(input())
g = []
for i in range(n):
    g.append(list(map(int, input().split())))
if valeurs_correctes(g, n) and sommes_egales(g, n):
    print("OUI")
else:
    print("NON")
