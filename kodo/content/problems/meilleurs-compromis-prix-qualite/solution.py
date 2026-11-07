import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
produits = []
for i in range(n):
    nom = donnees[1 + 3 * i]
    q = int(donnees[2 + 3 * i])
    p = int(donnees[3 + 3 * i])
    produits.append((p, -q, nom))   # prix croissant, note décroissante, nom

produits.sort()

gardes = []
meilleure = -1        # meilleure note parmi les produits déjà traités
i = 0
while i < n:
    p, moins_q, nom = produits[i]
    q = -moins_q
    # groupe des produits identiques (même prix, même note) : indices i à j-1
    j = i
    while j < n and produits[j][0] == p and produits[j][1] == moins_q:
        j = j + 1
    if q > meilleure:
        for k in range(i, j):
            gardes.append(produits[k][2])
        meilleure = q
    i = j

print(len(gardes))
for nom in gardes:
    print(nom)
