def etape(x, d):
    # compte les chiffres de x écrit avec exactement d chiffres (zéros devant compris)
    nb = [0] * 10
    for i in range(d):
        nb[x % 10] = nb[x % 10] + 1
        x = x // 10
    grand = 0
    for c in range(9, -1, -1):          # chiffres dans l'ordre décroissant
        for k in range(nb[c]):
            grand = grand * 10 + c
    petit = 0
    for c in range(10):                 # chiffres dans l'ordre croissant
        for k in range(nb[c]):
            petit = petit * 10 + c
    return grand - petit

d, x = map(int, input().split())
vus = set()
while x not in vus:
    vus.add(x)
    x = etape(x, d)
print(len(vus))
