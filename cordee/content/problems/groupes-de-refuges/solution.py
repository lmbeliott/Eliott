import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])

    # Listes d'adjacence : voisins[u] contient les refuges reliés à u.
    voisins = [[] for _ in range(n + 1)]
    for i in range(m):
        a = int(donnees[2 + 2 * i])
        b = int(donnees[3 + 2 * i])
        voisins[a].append(b)
        voisins[b].append(a)

    vu = [False] * (n + 1)
    nb_groupes = 0
    plus_grand = 0
    for depart in range(1, n + 1):
        if vu[depart]:
            continue
        # Nouveau groupe : on l'explore en entier avec une pile (DFS itératif).
        nb_groupes += 1
        vu[depart] = True
        pile = [depart]
        taille = 0
        while pile:
            u = pile.pop()
            taille += 1
            for v in voisins[u]:
                if not vu[v]:
                    vu[v] = True
                    pile.append(v)
        plus_grand = max(plus_grand, taille)

    print(nb_groupes)
    print(plus_grand)


main()
