import sys
from collections import deque


def main():
    donnees = sys.stdin.buffer.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    # Grille entourée d'une bordure de murs : plus besoin de tester les bords.
    larg = c + 2
    libre = bytearray(larg * (r + 2))
    depart = arrivee = 0
    for i in range(r):
        ligne = donnees[2 + i].decode()
        for j in range(c):
            case = (i + 1) * larg + j + 1
            if ligne[j] != '#':
                libre[case] = 1
            if ligne[j] == 'S':
                depart = case
            elif ligne[j] == 'T':
                arrivee = case

    # État = (case, direction) codé par case * 4 + direction.
    # Directions : 0 haut, 1 droite, 2 bas, 3 gauche.
    pas = (-larg, 1, larg, -1)
    INFINI = 1 << 30
    dist = [INFINI] * (4 * len(libre))
    fait = bytearray(4 * len(libre))
    file = deque()
    for d in range(4):
        dist[depart * 4 + d] = 0  # la première direction est libre
        file.append(depart * 4 + d)

    while file:
        e = file.popleft()
        if fait[e]:
            continue  # état déjà traité avec une meilleure distance
        fait[e] = 1
        case, d = e >> 2, e & 3
        k = dist[e]
        if case == arrivee:
            print(k)  # premier état de l'arrivée retiré : c'est le minimum
            return
        # Avancer tout droit : coût 0, à l'avant de la file.
        suivante = case + pas[d]
        if libre[suivante]:
            f = suivante * 4 + d
            if k < dist[f]:
                dist[f] = k
                file.appendleft(f)
        # Tourner d'un quart de tour : coût 1, à l'arrière de la file.
        for d2 in ((d + 1) & 3, (d + 3) & 3):
            f = case * 4 + d2
            if k + 1 < dist[f]:
                dist[f] = k + 1
                file.append(f)

    print(-1)


main()
