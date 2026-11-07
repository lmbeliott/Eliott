import sys

donnees = sys.stdin.read().split()
q = int(donnees[0])
lignes = []
for i in range(q):
    a = int(donnees[1 + 2 * i])
    b = int(donnees[2 + 2 * i])
    distance = 0
    while a != b:
        if a > b:
            a //= 2          # le plus grand n'est pas un ancêtre de l'autre : il monte
        else:
            b //= 2
        distance += 1
    lignes.append(f"{a} {distance}")
print("\n".join(lignes))
