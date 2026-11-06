import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])

    # Arbre de segments (maximum) : feuilles aux indices taille .. 2*taille - 1,
    # les fils du nœud k sont 2k et 2k + 1. Les feuilles en trop valent 0.
    taille = 1
    while taille < n:
        taille *= 2
    arbre = [0] * (2 * taille)
    for i in range(n):
        arbre[taille + i] = int(donnees[2 + i])
    for k in range(taille - 1, 0, -1):
        arbre[k] = max(arbre[2 * k], arbre[2 * k + 1])

    def modifie(i, v):  # le sommet d'indice i (à partir de 0) prend l'altitude v
        k = taille + i
        arbre[k] = v
        k //= 2
        while k >= 1:
            gauche, droite = arbre[2 * k], arbre[2 * k + 1]
            arbre[k] = gauche if gauche > droite else droite
            k //= 2

    def premier(i, h):  # premier indice j >= i d'altitude >= h, ou -1
        k = taille + i
        # Remontée : on saute vers la droite les blocs dont le maximum est trop petit.
        while arbre[k] < h:
            while k % 2 == 1:  # fils droit : on remonte
                k //= 2
            if k == 0:
                return -1  # on est sorti par la droite de l'arbre
            k += 1  # bloc voisin, juste à droite
        # Descente : le fils gauche s'il convient, sinon le droit.
        while k < taille:
            k = 2 * k if arbre[2 * k] >= h else 2 * k + 1
        return k - taille

    sortie = []
    pos = 2 + n
    for _ in range(q):
        op, a, b = donnees[pos], int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        if op == b'M':
            modifie(a - 1, b)
        else:
            j = premier(a - 1, b)
            sortie.append(j + 1 if j >= 0 else -1)

    print("\n".join(map(str, sortie)))


main()
