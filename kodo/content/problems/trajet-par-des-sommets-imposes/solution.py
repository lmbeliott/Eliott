import sys
import heapq

INFINI = 10 ** 18

donnees = sys.stdin.buffer.read().split()
n, m, k = int(donnees[0]), int(donnees[1]), int(donnees[2])
imposes = [int(x) for x in donnees[3:3 + k]]
voisins = [[] for _ in range(n + 1)]
pos = 3 + k
for _ in range(m):
    a, b, l = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
    pos += 3
    voisins[a].append((b, l))
    voisins[b].append((a, l))


def dijkstra(source):
    dist = [INFINI] * (n + 1)
    dist[source] = 0
    tas = [(0, source)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (dist[v], v))
    return dist


# dist[0] : distances depuis le départ ; dist[i] : depuis le i-ème sommet imposé.
# K + 1 exécutions de Dijkstra en tout.
dist = [dijkstra(1)] + [dijkstra(s) for s in imposes]
utilise = [False] * (k + 1)
meilleur = INFINI


def explorer(dernier, nb, total):
    # dernier : indice (dans dist) du dernier point visité ; nb : nombre de sommets imposés déjà visités
    global meilleur
    if nb == k:  # tous visités : il reste à aller en N
        if dist[dernier][n] < INFINI:
            meilleur = min(meilleur, total + dist[dernier][n])
        return
    for i in range(1, k + 1):
        if not utilise[i] and dist[dernier][imposes[i - 1]] < INFINI:
            nouveau = total + dist[dernier][imposes[i - 1]]
            if nouveau < meilleur:  # élagage : inutile de continuer si l'on fait déjà moins bien
                utilise[i] = True
                explorer(i, nb + 1, nouveau)
                utilise[i] = False


explorer(0, 0, 0)  # on essaie tous les ordres de visite, par retour sur trace
print(meilleur if meilleur < INFINI else -1)
