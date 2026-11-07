import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    parent = [0, 0] + [int(x) for x in donnees[2:n + 1]]  # le parent de la racine est 0
    enfants = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        enfants[parent[v]].append(v)

    # Parcours en profondeur sans récursion : profondeur, et positions debut[v] .. fin[v]
    # occupées par le sous-arbre de v dans l'ordre de visite.
    profondeur = [0] * (n + 1)
    debut = [0] * (n + 1)
    fin = [0] * (n + 1)
    compteur = 0
    pile = [1]
    while pile:
        v = pile.pop()
        if v > 0:
            compteur += 1
            debut[v] = compteur
            pile.append(-v)
            for e in enfants[v]:
                profondeur[e] = profondeur[v] + 1
                pile.append(e)
        else:
            fin[-v] = compteur

    # Remontée binaire pour l'ancêtre commun.
    LOG = max(1, n.bit_length())
    haut = [parent]
    for j in range(1, LOG):
        prec = haut[j - 1]
        haut.append([prec[prec[v]] for v in range(n + 1)])

    def lca(u, v):
        if profondeur[u] < profondeur[v]:
            u, v = v, u
        diff = profondeur[u] - profondeur[v]
        j = 0
        while diff:
            if diff & 1:
                u = haut[j][u]
            diff >>= 1
            j += 1
        if u == v:
            return u
        for j in range(LOG - 1, -1, -1):
            if haut[j][u] != haut[j][v]:
                u, v = haut[j][u], haut[j][v]
        return parent[u]

    # Deux arbres de Fenwick sur les positions : f1 contient c[z], f2 contient c[z] × profondeur[z],
    # où c est le tableau des « marques » posées par les ajouts.
    f1 = [0] * (n + 1)
    f2 = [0] * (n + 1)

    def marque(z, x):
        i, y = debut[z], x * profondeur[z]
        while i <= n:
            f1[i] += x
            f2[i] += y
            i += i & -i

    def prefixes(i):
        s1 = s2 = 0
        while i > 0:
            s1 += f1[i]
            s2 += f2[i]
            i -= i & -i
        return s1, s2

    sortie = []
    pos = n + 1
    for _ in range(q):
        if donnees[pos] == b"1":
            u, v, x = int(donnees[pos + 1]), int(donnees[pos + 2]), int(donnees[pos + 3])
            pos += 4
            # La valeur d'un sommet est la somme des marques de son sous-arbre.
            w = lca(u, v)
            marque(u, x)
            marque(v, x)
            marque(w, -x)
            if parent[w]:
                marque(parent[w], -x)
        else:
            v = int(donnees[pos + 1])
            pos += 2
            a1, a2 = prefixes(fin[v])
            b1, b2 = prefixes(debut[v] - 1)
            s1, s2 = a1 - b1, a2 - b2
            # Une marque c[z] en z compte pour les profondeur[z] - profondeur[v] + 1 sommets
            # du chemin de v à z.
            sortie.append(s2 - (profondeur[v] - 1) * s1)
    print("\n".join(map(str, sortie)))


main()
