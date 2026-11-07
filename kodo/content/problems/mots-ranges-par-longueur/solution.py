n = int(input())
mots = input().split()

# une liste par longueur possible (1 à 12), remplie dans l'ordre de lecture
paquets = []
for _ in range(13):
    paquets.append([])
for m in mots:
    paquets[len(m)].append(m)

resultat = []
for longueur in range(1, 13):
    for m in paquets[longueur]:
        resultat.append(m)
print(" ".join(resultat))
