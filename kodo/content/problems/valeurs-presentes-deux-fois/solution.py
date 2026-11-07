import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q, graine = (int(x) for x in donnees[:3])

    if graine == 0:
        a = [0] + [int(x) for x in donnees[3:3 + n]]
        lr = donnees[3 + n:3 + n + 2 * q]
        requetes = [(int(lr[2 * k]), int(lr[2 * k + 1])) for k in range(q)]
    else:
        # Générateur décrit dans l'énoncé
        v_max, d = int(donnees[3]), int(donnees[4])
        x = graine
        A, C, MASQUE = 6364136223846793005, 1442695040888963407, (1 << 64) - 1
        a = [0] * (n + 1)
        for i in range(1, n + 1):
            x = (x * A + C) & MASQUE
            a[i] = 1 + (x >> 33) % v_max
        requetes = []
        for _ in range(q):
            x = (x * A + C) & MASQUE
            l = 1 + (x >> 33) % d
            x = (x * A + C) & MASQUE
            r = n - (x >> 33) % d
            requetes.append((l, r) if l <= r else (r, l))

    # Requêtes regroupées par extrémité droite
    par_droite = [[] for _ in range(n + 1)]
    for k, (l, r) in enumerate(requetes):
        par_droite[r].append(k)

    # Fenwick sur les positions l : valeur(l) = somme des ajouts aux positions <= l
    arbre = [0] * (n + 2)

    def ajoute(i, delta):
        while i <= n:
            arbre[i] += delta
            i += i & -i

    # Pour chaque valeur : dernière, avant-dernière et antépénultième occurrence (0 = aucune)
    der = [0] * (n + 1)
    avant = [0] * (n + 1)
    ante = [0] * (n + 1)
    reponses = [0] * q
    for r in range(1, n + 1):
        v = a[r]
        # Avant r : v est présente exactement deux fois dans [l, r-1] pour ante < l <= avant.
        # Après r : pour avant < l <= der.
        if avant[v]:
            ajoute(ante[v] + 1, -1)
            ajoute(avant[v] + 1, 1)
        if der[v]:
            ajoute(avant[v] + 1, 1)
            ajoute(der[v] + 1, -1)
        ante[v], avant[v], der[v] = avant[v], der[v], r
        for k in par_droite[r]:
            i = requetes[k][0]
            s = 0
            while i > 0:
                s += arbre[i]
                i -= i & -i
            reponses[k] = s
    sys.stdout.write("\n".join(map(str, reponses)) + "\n")


main()
