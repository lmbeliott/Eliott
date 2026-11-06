n = int(input())

# total[nom] = somme des points reçus par la couleur.
total = {}
for _ in range(n):
    nom, points = input().split()
    if nom not in total:
        total[nom] = 0
    total[nom] += int(points)

# On trie des couples (-total, nom) : le plus grand total d'abord,
# puis, à total égal, l'ordre alphabétique.
classement = []
for nom in total:
    classement.append((-total[nom], nom))
classement.sort()

for moins_total, nom in classement:
    print(nom, -moins_total)
