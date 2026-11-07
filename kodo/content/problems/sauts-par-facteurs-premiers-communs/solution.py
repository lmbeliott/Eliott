import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, c = int(donnees[0]), int(donnees[1])
    a = [int(x) for x in donnees[2:2 + n]]

    # crible : plus petit facteur premier de chaque entier jusqu'au maximum
    vmax = max(a)
    ppf = list(range(vmax + 1))
    i = 2
    while i * i <= vmax:
        if ppf[i] == i:
            for j in range(i * i, vmax + 1, i):
                if ppf[j] == j:
                    ppf[j] = i
        i += 1

    # sommets 0..N-1 : les cases ; sommet N + p : le « carrefour » du nombre premier p
    voisins = [[] for _ in range(n + vmax + 1)]
    for i in range(n):
        if i + 1 < n:
            voisins[i].append((i + 1, c))
            voisins[i + 1].append((i, c))
        x = a[i]
        while x > 1:
            p = ppf[x]
            voisins[i].append((n + p, p))  # entrer dans le carrefour de p coûte p
            voisins[n + p].append((i, 0))  # en sortir vers une case multiple de p est gratuit
            while x % p == 0:
                x //= p

    dist = [INFINI] * (n + vmax + 1)
    dist[0] = 0
    tas = [(0, 0)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        if u == n - 1:
            break
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (dist[v], v))
    print(dist[n - 1])


main()
