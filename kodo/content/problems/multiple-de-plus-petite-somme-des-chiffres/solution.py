import heapq

k, b = map(int, input().split())

# sommets : les restes modulo K. Depuis le reste r :
#   « ajouter 1 »          mène à (r + 1) mod K, coût 1 ;
#   « multiplier par B »   mène à (r × B) mod K, coût 0.
INFINI = 10 ** 18
dist = [INFINI] * k
depart = 1 % k  # on part du nombre 1
dist[depart] = 0
tas = [(0, depart)]
while tas:
    d, r = heapq.heappop(tas)
    if d > dist[r]:
        continue
    if r == 0:
        break
    for v, c in (((r + 1) % k, 1), ((r * b) % k, 0)):
        if d + c < dist[v]:
            dist[v] = d + c
            heapq.heappush(tas, (dist[v], v))

print(dist[0] + 1)  # + 1 pour le chiffre 1 de départ
