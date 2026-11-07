n, k = map(int, input().split())
a = list(map(int, input().split()))

cpt = [0] * 1001        # exemplaires de chaque valeur dans la fenêtre [g, d]
differentes = 0
g = 0
meilleure = 0
debut = 0
for d in range(n):
    if cpt[a[d]] == 0:
        differentes = differentes + 1
    cpt[a[d]] = cpt[a[d]] + 1
    while differentes > k:          # trop de valeurs : on avance le début
        cpt[a[g]] = cpt[a[g]] - 1
        if cpt[a[g]] == 0:
            differentes = differentes - 1
        g = g + 1
    if d - g + 1 > meilleure:       # strictement plus longue : on garde la première
        meilleure = d - g + 1
        debut = g
print(meilleure, debut + 1)
