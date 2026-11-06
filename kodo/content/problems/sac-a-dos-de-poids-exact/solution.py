import sys

IMPOSSIBLE = -1


def main():
    donnees = sys.stdin.buffer.read().split()
    n, w_max = int(donnees[0]), int(donnees[1])

    # meilleur[w] = meilleure valeur d'une sélection de poids exactement w, ou IMPOSSIBLE.
    meilleur = [IMPOSSIBLE] * (w_max + 1)
    meilleur[0] = 0  # la sélection vide
    for i in range(n):
        p = int(donnees[2 + 2 * i])
        v = int(donnees[3 + 2 * i])
        # w décroissant : meilleur[w - p] ne contient pas encore cet objet.
        for w in range(w_max, p - 1, -1):
            avant = meilleur[w - p]
            if avant != IMPOSSIBLE and avant + v > meilleur[w]:
                meilleur[w] = avant + v

    print(meilleur[w_max])


main()
