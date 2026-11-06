import sys
from collections import deque


def main():
    donnees = sys.stdin.buffer.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    carte = donnees[2:2 + r]

    # On entoure la carte d'une bordure de rochers et on numérote les cases :
    # la case (i, j) devient i * largeur + j. Ses voisines sont k ± 1 et k ± largeur.
    largeur = c + 2
    libre = bytearray((r + 2) * largeur)
    dist = [-1] * ((r + 2) * largeur)
    file = deque()
    for i in range(r):
        ligne = carte[i]
        for j in range(c):
            if ligne[j] != ord('#'):
                k = (i + 1) * largeur + (j + 1)
                libre[k] = 1
                if ligne[j] == ord('A'):
                    # Tous les abris partent ensemble, à distance 0.
                    dist[k] = 0
                    file.append(k)

    # Parcours en largeur à sources multiples.
    while file:
        u = file.popleft()
        d = dist[u] + 1
        for v in (u - 1, u + 1, u - largeur, u + largeur):
            if libre[v] and dist[v] < 0:
                dist[v] = d
                file.append(v)

    plus_loin = max(dist)  # les abris sont à 0, donc le maximum est au moins 0
    sans_abri = sum(1 for k in range(len(dist)) if libre[k] and dist[k] < 0)
    print(plus_loin)
    print(sans_abri)


main()
