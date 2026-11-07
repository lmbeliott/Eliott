import sys

MOINS_INFINI = float("-inf")


def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    w = [0] + [int(x) for x in donnees[2:2 + n]]
    parent = [0, 0] + [int(x) for x in donnees[2 + n:2 + n + n - 1]]

    # meilleur[v][j] (1 <= j <= k) : plus grand poids d'un ensemble connexe de j sommets
    # dont v est le sommet le plus haut. La liste ne dépasse jamais k + 1 cases.
    meilleur = [None] + [[MOINS_INFINI, w[v]] for v in range(1, n + 1)]
    reponse = MOINS_INFINI

    # parent[i] < i : en parcourant v de n à 1, les enfants sont traités avant leur parent
    for v in range(n, 0, -1):
        mv = meilleur[v]
        if len(mv) > k:
            reponse = max(reponse, mv[k])
        if v == 1:
            break
        p = parent[v]
        mp = meilleur[p]
        # Fusion : on ajoute à l'ensemble de p (a sommets) un ensemble de b sommets qui descend de v.
        taille = min(k, len(mp) - 1 + len(mv) - 1)
        nouveau = mp + [MOINS_INFINI] * (taille + 1 - len(mp))
        for a in range(1, len(mp)):
            x = mp[a]
            for b in range(1, min(len(mv), taille - a + 1)):
                if x + mv[b] > nouveau[a + b]:
                    nouveau[a + b] = x + mv[b]
        meilleur[p] = nouveau
        meilleur[v] = None
    print(reponse)


main()
