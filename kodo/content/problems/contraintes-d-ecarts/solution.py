import sys

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    arcs = []
    for i in range(m):
        a, b, c = int(donnees[2 + 3 * i]), int(donnees[3 + 3 * i]), int(donnees[4 + 3 * i])
        arcs.append((a, b, c))  # x[b] - x[a] <= c : arc de a vers b, de longueur c

    # 1. Y a-t-il une solution ? Bellman-Ford depuis une source fictive reliée à tous les sommets
    pot = [0] * (n + 1)
    for tour in range(n):
        change = False
        for a, b, c in arcs:
            if pot[a] + c < pot[b]:
                pot[b] = pot[a] + c
                change = True
        if not change:
            break
    if change:  # encore une amélioration au N-ième tour : cycle de longueur négative
        print("IMPOSSIBLE")
        return

    # 2. Plus grande valeur de x[N] - x[1] : distance de 1 à N
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    for tour in range(n - 1):
        change = False
        for a, b, c in arcs:
            if dist[a] < INFINI and dist[a] + c < dist[b]:
                dist[b] = dist[a] + c
                change = True
        if not change:
            break
    print("INFINI" if dist[n] == INFINI else dist[n])


main()
