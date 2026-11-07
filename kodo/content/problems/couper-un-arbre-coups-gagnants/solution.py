import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, graine = int(donnees[0]), int(donnees[1])
    parent = [0] * (n + 1)  # parent[i] < i ; le sol est le sommet 0
    if graine == 0:
        for i in range(1, n + 1):
            parent[i] = int(donnees[1 + i])
    else:
        # Générateur décrit dans l'énoncé
        s, k = int(donnees[2]), int(donnees[3])
        A, C, MASQUE = 6364136223846793005, 1442695040888963407, (1 << 64) - 1
        x = graine
        for i in range(1, n + 1):
            x = (x * A + C) & MASQUE
            parent[i] = max(0, i - s * (1 + (x >> 33) % k))

    # 1) Nombres de Grundy, des feuilles vers le sol : g[v] = XOR sur les enfants c de (g[c] + 1)
    g = [0] * (n + 1)
    for v in range(n, 0, -1):
        g[parent[v]] ^= g[v] + 1

    # 2) Du sol vers les feuilles : besoin[v] = valeur que g[v] doit prendre après le coup
    #    pour que le sol vaille 0 (-1 : impossible avec un coup dans le sous-arbre de v).
    besoin = [-1] * (n + 1)
    besoin[0] = 0
    gagnants = 0
    for v in range(1, n + 1):
        p = parent[v]
        b = besoin[p]
        if b < 0:
            continue
        # Couper l'arête (p, v) : g[p] devient g[p] XOR (g[v] + 1)
        if g[p] ^ (g[v] + 1) == b:
            gagnants += 1
        # Un coup plus bas dans le sous-arbre de v doit donner g'[v] + 1 = b XOR g[p] XOR (g[v] + 1)
        z = b ^ g[p] ^ (g[v] + 1)
        if z > 0:
            besoin[v] = z - 1
    print(gagnants)


main()
