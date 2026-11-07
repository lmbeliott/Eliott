import sys


def fonction_z(s):
    # z[i] = longueur du plus long préfixe commun à s et à s[i..]
    n = len(s)
    z = [0] * n
    z[0] = n
    g = d = 0  # [g, d[ : la boîte Z qui va le plus loin à droite
    for i in range(1, n):
        k = 0
        if i < d:
            k = min(d - i, z[i - g])
        while i + k < n and s[k] == s[i + k]:
            k += 1
        z[i] = k
        if i + k > d:
            g, d = i, i + k
    return z


def main():
    s = sys.stdin.readline().strip()
    n = len(s)
    z = fonction_z(s)

    # Le préfixe de longueur L commence en i exactement quand z[i] >= L.
    # par_valeur[v] : les positions i telles que z[i] = v
    par_valeur = [[] for _ in range(n + 1)]
    for i in range(n):
        par_valeur[z[i]].append(i)

    # Liste doublement chaînée des positions encore présentes, terminée par la sentinelle n
    precedent = list(range(-1, n))
    suivant = list(range(1, n + 2))
    ecart_max = 1  # plus grand écart entre deux positions présentes consécutives (sentinelle comprise)

    longueurs = []
    for L in range(1, n + 1):
        # Les positions où z[i] = L - 1 ne sont plus des occurrences du préfixe de longueur L.
        for i in par_valeur[L - 1]:
            a, b = precedent[i], suivant[i]
            suivant[a] = b
            precedent[b] = a
            ecart_max = max(ecart_max, b - a)
        # Le préfixe couvre le mot si chaque occurrence touche la suivante, et la dernière finit en n.
        if ecart_max <= L:
            longueurs.append(L)
    print(len(longueurs))
    print(" ".join(map(str, longueurs)))


main()
