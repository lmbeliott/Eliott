import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
periodes = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]
periodes.sort(key=lambda p: p[1])        # par fin croissante

controles = 0
dernier = -1                             # minute du dernier contrôle placé
for a, b in periodes:
    if a > dernier:                      # période pas encore touchée
        controles += 1
        dernier = b
print(controles)
