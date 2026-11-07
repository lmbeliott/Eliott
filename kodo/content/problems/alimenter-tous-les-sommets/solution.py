import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    # Le sommet fictif 0 représente « la source » : installer une source en i,
    # c'est construire l'arête 0 — i de coût P[i].
    aretes = [(int(donnees[1 + i]), 0, i) for i in range(1, n + 1)]
    pos = 2 + n
    for _ in range(m):
        a, b, c = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        aretes.append((c, a, b))
    aretes.sort()

    # Union-find avec union par taille et compression de chemin.
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def racine(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    # Algorithme de Kruskal sur les N + 1 sommets.
    total = 0
    restantes = n  # nombre d'arêtes encore nécessaires pour tout relier
    for c, a, b in aretes:
        ra, rb = racine(a), racine(b)
        if ra == rb:
            continue
        if taille[ra] < taille[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        taille[ra] += taille[rb]
        total += c
        restantes -= 1
        if restantes == 0:
            break
    print(total)


main()
