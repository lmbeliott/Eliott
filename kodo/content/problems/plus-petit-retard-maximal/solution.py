import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
commandes = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]
commandes.sort(key=lambda c: c[1])      # par date limite croissante

instant = 0
pire = 0
for p, d in commandes:
    instant += p
    pire = max(pire, instant - d)
print(pire)
