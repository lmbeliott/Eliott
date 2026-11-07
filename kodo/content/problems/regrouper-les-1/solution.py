n = int(input())
liste = list(map(int, input().split()))

# Nombre total de 1.
total = 0
for x in liste:
    total = total + x

# Chaque 0 passe par-dessus les 1 de gauche ou ceux de droite :
# il choisit le côté qui en a le moins.
echanges = 0
avant = 0
for x in liste:
    if x == 1:
        avant = avant + 1
    else:
        echanges = echanges + min(avant, total - avant)

print(echanges)
