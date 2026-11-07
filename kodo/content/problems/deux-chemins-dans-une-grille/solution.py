import sys


def main():
    lignes = sys.stdin.read().split()
    r, c = int(lignes[0]), int(lignes[1])
    grille = lignes[2:2 + r]
    # valeur[i][j] : chiffre de la case, ou -1 si elle est interdite
    valeur = [[-1 if ch == '#' else int(ch) for ch in ligne] for ligne in grille]

    # On fait avancer les deux chemins en même temps : après s mouvements, chacun est
    # sur une case (i, s - i). L'état est le couple des lignes (i1, i2), avec i1 <= i2.
    # meilleur[i1][i2] : meilleure valeur totale, ou None si l'état est impossible.
    meilleur = [[None] * r for _ in range(r)]
    if valeur[0][0] >= 0:
        meilleur[0][0] = valeur[0][0]
    for s in range(1, r + c - 1):
        nouveau = [[None] * r for _ in range(r)]
        bas = max(0, s - (c - 1))
        haut = min(r - 1, s)
        for i1 in range(bas, haut + 1):
            v1 = valeur[i1][s - i1]
            if v1 < 0:
                continue
            for i2 in range(i1, haut + 1):
                v2 = valeur[i2][s - i2]
                if v2 < 0:
                    continue
                # chaque chemin vient de la case au-dessus (ligne - 1) ou à gauche (même ligne)
                best = None
                for p1 in (i1 - 1, i1):
                    for p2 in (i2 - 1, i2):
                        if p1 < 0 or p2 < 0:
                            continue
                        x = meilleur[min(p1, p2)][max(p1, p2)]
                        if x is not None and (best is None or x > best):
                            best = x
                if best is not None:
                    # une case visitée par les deux chemins ne compte qu'une fois
                    nouveau[i1][i2] = best + v1 + (v2 if i2 != i1 else 0)
        meilleur = nouveau

    resultat = meilleur[r - 1][r - 1]
    print(-1 if resultat is None else resultat)


main()
