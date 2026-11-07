import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    a = [int(x) for x in donnees[1:1 + n]]

    # crible : plus petit facteur premier jusqu'au maximum
    vmax = max(a)
    ppf = list(range(vmax + 1))
    i = 2
    while i * i <= vmax:
        if ppf[i] == i:
            for j in range(i * i, vmax + 1, i):
                if ppf[j] == j:
                    ppf[j] = i
        i += 1

    # pour chaque nombre premier p : la liste des positions dont le nombre est multiple de p
    multiples = {}
    for i in range(n):
        x = a[i]
        while x > 1:
            p = ppf[x]
            multiples.setdefault(p, []).append(i)
            while x % p == 0:
                x //= p

    # seules servent les liaisons entre le plus petit multiple de p et les autres multiples de p
    aretes = []
    for liste in multiples.values():
        m = min(liste, key=lambda i: a[i])
        for j in liste:
            if j != m:
                aretes.append((a[m] + a[j], m, j))
    aretes.sort()

    parent = list(range(n))
    taille = [1] * n

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    total, nb = 0, 0
    for c, i, j in aretes:  # Kruskal
        ri, rj = trouver(i), trouver(j)
        if ri != rj:
            if taille[ri] < taille[rj]:
                ri, rj = rj, ri
            parent[rj] = ri
            taille[ri] += taille[rj]
            total += c
            nb += 1
    print(total if nb == n - 1 else -1)


main()
