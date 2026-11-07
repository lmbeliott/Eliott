import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, q = int(donnees[0]), int(donnees[1]), int(donnees[2])
    aretes = [(int(donnees[3 + 2 * i]), int(donnees[4 + 2 * i])) for i in range(m)]
    coupures = [int(x) - 1 for x in donnees[3 + 2 * m:3 + 2 * m + q]]

    parent = list(range(n + 1))
    taille = [1] * (n + 1)
    plus_grande = 1

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    def unir(a, b):
        nonlocal plus_grande
        a, b = trouver(a), trouver(b)
        if a != b:
            if taille[a] < taille[b]:
                a, b = b, a
            parent[b] = a
            taille[a] += taille[b]
            plus_grande = max(plus_grande, taille[a])

    # état final : toutes les liaisons sauf celles qui seront coupées
    coupee = [False] * m
    for e in coupures:
        coupee[e] = True
    for e in range(m):
        if not coupee[e]:
            unir(*aretes[e])

    # on remonte le temps : couper la liaison i, c'est l'ajouter quand on va à l'envers
    reponse = [0] * q
    for i in range(q - 1, -1, -1):
        reponse[i] = plus_grande
        unir(*aretes[coupures[i]])
    print(" ".join(map(str, reponse)))


main()
