import sys

PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
BORNE = 10 ** 18


def plus_petit(k):
    meilleur = BORNE + 1

    # n = 2^e1 × 3^e2 × 5^e3 × ... avec e1 ≥ e2 ≥ e3 ≥ ... ; reste : diviseurs encore à « fabriquer »
    def explorer(i, reste, valeur, emax):
        nonlocal meilleur
        if reste == 1:
            meilleur = min(meilleur, valeur)
            return
        if i == len(PREMIERS):
            return
        p = PREMIERS[i]
        for e in range(1, emax + 1):
            valeur *= p
            if valeur >= meilleur:
                break  # élagage : on ne fera pas mieux
            if reste % (e + 1) == 0:
                explorer(i + 1, reste // (e + 1), valeur, e)

    explorer(0, k, 1, 64)
    return meilleur


donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(plus_petit(int(x))) for x in donnees[1:1 + t]))
