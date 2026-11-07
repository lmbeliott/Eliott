import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    a = [int(x) for x in donnees[1:1 + n]]
    pref = [0] * (n + 1)  # pref[i] = a[0] + ... + a[i-1]
    for i in range(n):
        pref[i + 1] = pref[i] + a[i]

    # cout[i][j] = coût minimal pour fusionner a[i..j] en un seul nombre.
    cout = [[0] * n for _ in range(n)]
    for longueur in range(2, n + 1):
        for i in range(n - longueur + 1):
            j = i + longueur - 1
            ligne_i = cout[i]
            meilleur = None
            # La dernière fusion réunit a[i..k] et a[k+1..j].
            for k in range(i, j):
                gauche = pref[k + 1] - pref[i]
                droite = pref[j + 1] - pref[k + 1]
                c = ligne_i[k] + cout[k + 1][j] + abs(gauche - droite)
                if meilleur is None or c < meilleur:
                    meilleur = c
            ligne_i[j] = meilleur

    print(cout[0][n - 1])


main()
