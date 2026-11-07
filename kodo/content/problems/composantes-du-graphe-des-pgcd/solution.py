import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    # on abaisse le seuil de N à 1 : au seuil d, on relie d à chacun de ses multiples
    composantes = n
    reponse = [0] * (n + 1)  # reponse[t] : nombre de composantes pour le seuil t
    for d in range(n, 0, -1):
        for multiple in range(2 * d, n + 1, d):
            a, b = trouver(d), trouver(multiple)
            if a != b:
                if taille[a] < taille[b]:
                    a, b = b, a
                parent[b] = a
                taille[a] += taille[b]
                composantes -= 1
        reponse[d] = composantes

    print(" ".join(str(reponse[int(t)]) for t in donnees[2:2 + q]))


main()
