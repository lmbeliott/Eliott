import sys
from bisect import bisect_right

def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    a = [int(x) for x in donnees[2:2 + n]]
    total = sum(a)

    # sommes préfixes sur le cercle déplié deux fois : a[0..n-1] puis encore a[0..n-1]
    pref = [0]
    for x in a + a:
        pref.append(pref[-1] + x)

    def possible(d):
        # peut-on couper le cercle en au plus k arcs de poids <= d ? (d >= max(a))
        if d >= total:
            return True

        def suivant(i):
            # fin (exclue) de l'arc le plus long qui commence en i et pèse au plus d
            return bisect_right(pref, pref[i] + d) - 1

        def arcs_depuis(debut):
            # nombre d'arcs du découpage glouton qui commence en debut (arrêt après k + 1)
            pos, nb = debut, 0
            while pos < debut + n and nb <= k:
                pos = suivant(pos)
                nb += 1
            return nb

        if arcs_depuis(0) <= k:
            return True
        # un bon découpage, s'il existe, coupe juste après l'une des cases de l'arc
        # glouton le plus court : on essaie seulement ces débuts-là
        p = min(range(n), key=lambda i: suivant(i) - i)
        for debut in range(p + 1, suivant(p) + 1):
            if arcs_depuis(debut % n) <= k:
                return True
        return False

    trop_petit = max(max(a), (total + k - 1) // k) - 1   # aucun découpage ne fait mieux
    suffisant = (total + k - 1) // k + max(a)            # le glouton depuis la case 1 y arrive
    while suffisant - trop_petit > 1:
        milieu = (trop_petit + suffisant) // 2
        if possible(milieu):
            suffisant = milieu
        else:
            trop_petit = milieu
    print(suffisant)

main()
