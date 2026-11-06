import sys

IMPOSSIBLE = -1


def main():
    donnees = sys.stdin.buffer.read().split()
    n, w_max = int(donnees[0]), int(donnees[1])

    # meilleur[w] = meilleure utilité d'un chargement d'exactement w kg, ou IMPOSSIBLE.
    meilleur = [IMPOSSIBLE] * (w_max + 1)
    meilleur[0] = 0  # le chargement vide
    for i in range(n):
        p = int(donnees[2 + 2 * i])
        u = int(donnees[3 + 2 * i])
        # w décroissant : meilleur[w - p] ne contient pas encore ce colis.
        for w in range(w_max, p - 1, -1):
            avant = meilleur[w - p]
            if avant != IMPOSSIBLE and avant + u > meilleur[w]:
                meilleur[w] = avant + u

    print(meilleur[w_max])


main()
