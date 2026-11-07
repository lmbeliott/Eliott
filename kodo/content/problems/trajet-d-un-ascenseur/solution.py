n = int(input())
etage = 0
distance = 0
plus_haut = 0
dernier = 0   # sens du dernier déplacement : 1 monte, -1 descend, 0 pas encore bougé
changements = 0
for i in range(n):
    c = int(input())
    if c > etage:
        distance = distance + c - etage
        sens = 1
    elif c < etage:
        distance = distance + etage - c
        sens = -1
    else:
        sens = 0
    if sens != 0:
        if dernier != 0:
            if sens != dernier:
                changements = changements + 1
        dernier = sens
    etage = c
    if etage > plus_haut:
        plus_haut = etage
print(distance)
print(plus_haut)
print(changements)
