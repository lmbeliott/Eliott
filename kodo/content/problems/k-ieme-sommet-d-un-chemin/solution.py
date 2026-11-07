import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    parent = [0, 0] + [int(x) for x in donnees[2:n + 1]]  # le parent de la racine est 0
    enfants = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        enfants[parent[v]].append(v)

    # Profondeurs, par un parcours en largeur depuis la racine.
    profondeur = [0] * (n + 1)
    ordre = [1]
    for u in ordre:
        for v in enfants[u]:
            profondeur[v] = profondeur[u] + 1
            ordre.append(v)

    # haut[j][v] = ancêtre de v situé 2^j niveaux plus haut (0 si on sort de l'arbre).
    LOG = max(1, n.bit_length())
    haut = [parent]
    for j in range(1, LOG):
        prec = haut[j - 1]
        haut.append([prec[prec[v]] for v in range(n + 1)])

    def ancetre(v, k):
        # Remonte de k niveaux en décomposant k en puissances de deux.
        j = 0
        while k:
            if k & 1:
                v = haut[j][v]
            k >>= 1
            j += 1
        return v

    def lca(u, v):
        if profondeur[u] < profondeur[v]:
            u, v = v, u
        u = ancetre(u, profondeur[u] - profondeur[v])
        if u == v:
            return u
        for j in range(LOG - 1, -1, -1):
            if haut[j][u] != haut[j][v]:
                u, v = haut[j][u], haut[j][v]
        return parent[u]

    sortie = []
    pos = n + 1
    for _ in range(q):
        u, v, k = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        w = lca(u, v)
        montee = profondeur[u] - profondeur[w]   # nombre d'arêtes de u à w
        descente = profondeur[v] - profondeur[w]  # nombre d'arêtes de w à v
        if k > montee + descente:
            sortie.append(-1)
        elif k <= montee:
            sortie.append(ancetre(u, k))
        else:
            sortie.append(ancetre(v, montee + descente - k))  # compté depuis v
    print("\n".join(map(str, sortie)))


main()
