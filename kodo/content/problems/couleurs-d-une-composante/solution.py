import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, q, graine = (int(x) for x in donnees[:4])

    if graine == 0:
        pos = 4
        couleur = [0] + [int(x) for x in donnees[pos:pos + n]]
        pos += n
        aretes = [(int(donnees[pos + 3 * i + 2]), int(donnees[pos + 3 * i]), int(donnees[pos + 3 * i + 1])) for i in range(m)]
        pos += 3 * m
        requetes = [(int(donnees[pos + 2 * k + 1]), int(donnees[pos + 2 * k])) for k in range(q)]
    else:
        # Générateur décrit dans l'énoncé
        pa, pb, w_max, k_max = (int(x) for x in donnees[4:8])
        A, C, MASQUE = 6364136223846793005, 1442695040888963407, (1 << 64) - 1
        x = graine
        suite = []
        for _ in range(n + 3 * m + 2 * q):
            x = (x * A + C) & MASQUE
            suite.append(x >> 33)
        couleur = [0] + [1 + s % k_max for s in suite[:n]]
        aretes = [(1 + suite[n + 3 * i + 2] % w_max, 1 + suite[n + 3 * i] % pa, 1 + suite[n + 3 * i + 1] % pb) for i in range(m)]
        base = n + 3 * m
        requetes = [(1 + suite[base + 2 * k + 1] % w_max, 1 + suite[base + 2 * k] % n) for k in range(q)]

    # Union-find ; ensembles[r] = couleurs de la composante de racine r
    parent = list(range(n + 1))
    ensembles = [{c} for c in couleur]

    def racine(u):
        while parent[u] != u:
            parent[u] = parent[parent[u]]
            u = parent[u]
        return u

    aretes.sort()
    ordre = sorted(range(q), key=lambda k: requetes[k][0])
    reponses = [0] * q
    i = 0
    for k in ordre:
        t, v = requetes[k]
        # On ajoute toutes les arêtes de poids <= t (hors ligne : t croissant)
        while i < m and aretes[i][0] <= t:
            _, u1, u2 = aretes[i]
            i += 1
            r1, r2 = racine(u1), racine(u2)
            if r1 == r2:
                continue
            # Petit dans grand : on vide toujours le plus petit ensemble dans le plus grand
            if len(ensembles[r1]) < len(ensembles[r2]):
                r1, r2 = r2, r1
            ensembles[r1] |= ensembles[r2]
            ensembles[r2] = None
            parent[r2] = r1
        reponses[k] = len(ensembles[racine(v)])
    sys.stdout.write("\n".join(map(str, reponses)) + "\n")


main()
