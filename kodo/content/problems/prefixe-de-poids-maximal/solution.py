import sys


def fonction_z(s):
    # z[i] = longueur du plus long préfixe commun à s et à s[i:]
    n = len(s)
    z = [0] * n
    z[0] = n
    g, d = 0, 0  # [g, d[ : la boîte Z qui va le plus loin à droite
    for i in range(1, n):
        if i < d:
            z[i] = min(d - i, z[i - g])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > d:
            g, d = i, i + z[i]
    return z


def main():
    s = sys.stdin.readline().strip()
    n = len(s)
    z = fonction_z(s)

    # nb[k] = nombre de positions i où z[i] vaut exactement k
    nb = [0] * (n + 2)
    for v in z:
        nb[v] += 1

    # occ(k) = nombre de positions où z[i] >= k : somme des nb[v] pour v >= k
    meilleur_k, meilleur_poids = 0, -1
    occ = 0
    for k in range(n, 0, -1):
        occ += nb[k]
        poids = k * occ
        if poids >= meilleur_poids:  # >= : on garde le plus petit k en cas d'égalité
            meilleur_k, meilleur_poids = k, poids
    print(meilleur_k, meilleur_poids)


main()
