import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, k, m = int(donnees[0]), int(donnees[1]), int(donnees[2])
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    def unir(a, b):
        a, b = trouver(a), trouver(b)
        if a == b:
            return False
        if taille[a] < taille[b]:
            a, b = b, a
        parent[b] = a
        taille[a] += taille[b]
        return True

    composantes = n
    pos = 3
    for _ in range(k):  # les liaisons existantes sont gratuites
        if unir(int(donnees[pos]), int(donnees[pos + 1])):
            composantes -= 1
        pos += 2
    candidates = []
    for _ in range(m):
        candidates.append((int(donnees[pos + 2]), int(donnees[pos]), int(donnees[pos + 1])))
        pos += 3

    # Kruskal sur les liaisons à construire, de la moins chère à la plus chère
    candidates.sort()
    total = 0
    for c, a, b in candidates:
        if unir(a, b):
            total += c
            composantes -= 1
    print(total if composantes == 1 else -1)


main()
