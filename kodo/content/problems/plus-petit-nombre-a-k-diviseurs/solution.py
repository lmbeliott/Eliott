import sys

PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
BORNE = 10 ** 18


def explorer(i, reste, valeur, emax, meilleur):
    # valeur = 2^e1 × 3^e2 × ... jusqu'au (i-1)-ème premier, avec e1 ≥ e2 ≥ ... ;
    # reste : facteur du nombre de diviseurs encore à « fabriquer ».
    # Renvoie le plus petit nombre trouvé (ou meilleur, si la branche ne fait pas mieux).
    if reste == 1:
        return min(meilleur, valeur)
    if i == len(PREMIERS):
        return meilleur
    p = PREMIERS[i]
    for e in range(1, emax + 1):
        valeur *= p
        if valeur >= meilleur:
            break  # élagage : on ne fera pas mieux
        if reste % (e + 1) == 0:
            meilleur = explorer(i + 1, reste // (e + 1), valeur, e, meilleur)
    return meilleur


donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(explorer(0, int(x), 1, 64, BORNE + 1)) for x in donnees[1:1 + t]))
