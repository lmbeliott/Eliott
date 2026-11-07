import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
caisses = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]
caisses.sort(key=lambda c: c[0] + c[1])     # du haut vers le bas, w + s croissant

dessus = 0              # poids des caisses déjà posées au-dessus
pire = None
for w, s in caisses:
    risque = dessus - s
    if pire is None or risque > pire:
        pire = risque
    dessus += w
print(pire)
