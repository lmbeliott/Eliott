import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    aretes = []
    for i in range(m):
        a, b, w = int(donnees[2 + 3 * i]), int(donnees[3 + 3 * i]), int(donnees[4 + 3 * i])
        aretes.append((w, a, b))
    aretes.sort()

    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    # Kruskal : l'arête qui fusionne A et B est le goulet de toutes les paires (a, b) de A × B
    total = 0
    for w, a, b in aretes:
        a, b = trouver(a), trouver(b)
        if a != b:
            total += w * taille[a] * taille[b]
            if taille[a] < taille[b]:
                a, b = b, a
            parent[b] = a
            taille[a] += taille[b]
    print(total)


main()
