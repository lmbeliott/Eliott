import sys
from bisect import bisect_left


def main():
    donnees = sys.stdin.buffer.read().split()
    n, d = int(donnees[0]), int(donnees[1])
    a = [int(x) for x in donnees[2:2 + n]]
    w = [int(x) for x in donnees[2 + n:2 + 2 * n]]

    # Rang de chaque indice quand on trie par (valeur, indice) : les rangs sont tous différents.
    ordre = sorted(range(n), key=lambda i: (a[i], i))
    rang = [0] * n
    for r, i in enumerate(ordre):
        rang[i] = r
    valeurs_triees = [a[i] for i in ordre]

    # Arbre de segments (maximum) sur les rangs. Une case vaut 0 si l'indice n'est pas dans la fenêtre.
    taille = 1
    while taille < n:
        taille *= 2
    arbre = [0] * (2 * taille)

    def ecrire(pos, valeur):
        pos += taille
        arbre[pos] = valeur
        pos //= 2
        while pos:
            arbre[pos] = max(arbre[2 * pos], arbre[2 * pos + 1])
            pos //= 2

    def max_prefixe(r):
        # maximum des cases de rang 0 à r - 1
        res = 0
        g, d_ = taille, taille + r
        while g < d_:
            if g & 1:
                res = max(res, arbre[g])
                g += 1
            if d_ & 1:
                d_ -= 1
                res = max(res, arbre[d_])
            g //= 2
            d_ //= 2
        return res

    dp = [0] * n
    for i in range(n):
        if i - d - 1 >= 0:
            ecrire(rang[i - d - 1], 0)  # cet indice est trop loin derrière i
        # Les valeurs strictement plus petites que a[i] ont les rangs 0 à limite - 1.
        limite = bisect_left(valeurs_triees, a[i])
        dp[i] = w[i] + max_prefixe(limite)
        ecrire(rang[i], dp[i])
    print(max(dp))


main()
