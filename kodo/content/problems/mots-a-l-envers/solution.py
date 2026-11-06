n = int(input())
identiques = 0

for _ in range(n):
    mot = input()
    # On construit le mot à l'envers, de la dernière lettre à la première.
    envers = ""
    for i in range(len(mot) - 1, -1, -1):
        envers = envers + mot[i]
    print(envers)
    if envers == mot:
        identiques += 1

print(identiques)
