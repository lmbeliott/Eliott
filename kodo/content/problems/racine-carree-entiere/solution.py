q = int(input())
for i in range(q):
    n = int(input())
    r = int(n ** 0.5)            # valeur approchée, parfois fausse d'une unité
    while r * r > n:             # trop grand : on descend
        r = r - 1
    while (r + 1) * (r + 1) <= n:   # trop petit : on monte
        r = r + 1
    print(r, n - r * r)
