import sys
from collections import deque


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    voisins = [[] for _ in range(n + 1)]
    for i in range(m):
        a = int(donnees[2 + 2 * i])
        b = int(donnees[3 + 2 * i])
        voisins[a].append(b)
        voisins[b].append(a)

    couleur = [-1] * (n + 1)  # -1 : pas encore colorié
    total = 0
    for depart in range(1, n + 1):
        if couleur[depart] != -1:
            continue
        # Coloriage de la composante de « depart » en alternant 0 et 1.
        couleur[depart] = 0
        compte = [1, 0]
        file = deque([depart])
        while file:
            u = file.popleft()
            for v in voisins[u]:
                if couleur[v] == -1:
                    couleur[v] = 1 - couleur[u]
                    compte[couleur[v]] += 1
                    file.append(v)
                elif couleur[v] == couleur[u]:
                    # Deux voisins de même couleur : cycle impair, aucun partage possible.
                    print(-1)
                    return
        # Inès prend la plus petite des deux couleurs de cette composante.
        total += min(compte)

    print(total)


main()
