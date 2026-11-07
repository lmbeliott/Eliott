import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    successeurs = [[] for _ in range(n + 1)]
    pos = 2
    for _ in range(m):
        a, b, l = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        successeurs[a].append((b, l))

    dist = [INFINI] * (n + 1)
    pred = [0] * (n + 1)  # pred[v] : sommet d'où l'on vient sur le meilleur chemin connu
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        if u == n:
            break  # la distance de N est définitive
        for v, l in successeurs[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                pred[v] = u
                heapq.heappush(tas, (dist[v], v))

    if dist[n] == INFINI:
        print(-1)
        return
    # on remonte les prédécesseurs depuis N, puis on retourne la liste
    chemin = [n]
    while chemin[-1] != 1:
        chemin.append(pred[chemin[-1]])
    chemin.reverse()
    print(dist[n], len(chemin))
    print(*chemin)


main()
