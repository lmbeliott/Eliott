import sys
import heapq


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, budget = int(donnees[0]), int(donnees[1]), int(donnees[2])
    routes = []
    for i in range(m):
        a, b, l, t = (int(x) for x in donnees[3 + 4 * i:7 + 4 * i])
        routes.append((a, b, l, t))
    if n == 1:
        print(0)
        return

    def possible(seuil):
        # Dijkstra en n'utilisant que les routes de péage au plus seuil
        voisins = [[] for _ in range(n + 1)]
        for a, b, l, t in routes:
            if t <= seuil:
                voisins[a].append((b, l))
                voisins[b].append((a, l))
        dist = [budget + 1] * (n + 1)  # au-delà du budget, inutile de continuer
        dist[1] = 0
        tas = [(0, 1)]
        while tas:
            d, u = heapq.heappop(tas)
            if d > dist[u]:
                continue
            if u == n:
                return True
            for v, l in voisins[u]:
                if d + l < dist[v]:
                    dist[v] = d + l
                    heapq.heappush(tas, (dist[v], v))
        return False

    peages = sorted(set(t for a, b, l, t in routes))
    if not peages or not possible(peages[-1]):
        print(-1)
        return
    bas, haut = 0, len(peages) - 1  # possible(peages[haut]) est vrai
    while bas < haut:
        milieu = (bas + haut) // 2
        if possible(peages[milieu]):
            haut = milieu
        else:
            bas = milieu + 1
    print(peages[bas])


main()
