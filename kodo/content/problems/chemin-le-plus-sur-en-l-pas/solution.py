import sys


def main():
    donnees = list(map(int, sys.stdin.buffer.read().split()))
    r, c, lmax = donnees[0], donnees[1], donnees[2]

    # Grille entourée d'une bordure de cases interdites (valeur 0) ; (i, j) -> i * largeur + j
    largeur = c + 2
    valeur = [0] * ((r + 2) * largeur)
    for i in range(r):
        base = (i + 1) * largeur + 1
        valeur[base:base + c] = donnees[3 + i * c:3 + (i + 1) * c]
    depart = largeur + 1
    arrivee = r * largeur + c
    pas = (1, -1, largeur, -largeur)

    def atteignable(seuil):
        # Parcours en largeur sur les cases de valeur >= seuil : arrivée en au plus lmax pas ?
        if valeur[depart] < seuil or valeur[arrivee] < seuil:
            return False
        if depart == arrivee:
            return True
        dist = {depart: 0}
        file = [depart]
        for u in file:
            d = dist[u]
            if d == lmax:
                return False  # la file est triée par distance : plus rien n'arrivera à temps
            for delta in pas:
                v = u + delta
                if valeur[v] >= seuil and v not in dist:
                    if v == arrivee:
                        return True  # atteinte en d + 1 <= lmax pas
                    dist[v] = d + 1
                    file.append(v)
        return False

    # Les qualités possibles sont les valeurs de la grille ; plus le seuil est bas, plus c'est facile.
    candidats = sorted(set(x for x in valeur if x > 0))
    if not atteignable(candidats[0]):
        print(-1)
        return
    bas, haut = 0, len(candidats) - 1
    while bas < haut:
        milieu = (bas + haut + 1) // 2
        if atteignable(candidats[milieu]):
            bas = milieu
        else:
            haut = milieu - 1
    print(candidats[bas])


main()
