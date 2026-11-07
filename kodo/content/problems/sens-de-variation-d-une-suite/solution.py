n = int(input())
precedent = int(input())
monte = False
descend = False
for i in range(n - 1):
    x = int(input())
    if x > precedent:
        monte = True
    if x < precedent:
        descend = True
    precedent = x
if not monte and not descend:
    print("CONSTANTE")
elif monte and not descend:
    print("CROISSANTE")
elif descend and not monte:
    print("DECROISSANTE")
else:
    print("AUCUNE")
