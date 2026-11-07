n = int(input())
c = list(map(int, input().split()))

# tri par comptage des valeurs plafonnées à n
cpt = [0] * (n + 1)
for v in c:
    cpt[min(v, n)] = cpt[min(v, n)] + 1

au_moins = 0          # nombre d'articles cités au moins h fois
h = n
while True:
    au_moins = au_moins + cpt[h]
    if au_moins >= h:
        print(h)
        break
    h = h - 1
