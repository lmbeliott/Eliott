import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    x = [int(v) for v in donnees[1:1 + 2 * n:2]]
    y = [int(v) for v in donnees[2:2 + 2 * n:2]]

    # seules comptent les arêtes entre voisins dans l'ordre des x et dans l'ordre des y
    aretes = []
    for coord in (x, y):
        ordre = sorted(range(n), key=lambda i: coord[i])
        for k in range(n - 1):
            i, j = ordre[k], ordre[k + 1]
            aretes.append((coord[j] - coord[i], i, j))
    aretes.sort()

    parent = list(range(n))
    taille = [1] * n

    def trouver(v):
        racine = v
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[v] != racine:
            parent[v], v = racine, parent[v]
        return racine

    total = 0
    for c, i, j in aretes:  # Kruskal
        a, b = trouver(i), trouver(j)
        if a != b:
            if taille[a] < taille[b]:
                a, b = b, a
            parent[b] = a
            taille[a] += taille[b]
            total += c
    print(total)


main()
