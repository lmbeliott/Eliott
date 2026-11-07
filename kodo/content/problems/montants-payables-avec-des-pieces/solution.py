import heapq

k, x = map(int, input().split())
pieces = list(map(int, input().split()))
m = min(pieces)

# dist[r] : plus petit montant payable de reste r modulo m (sommets : les restes)
INFINI = 10 ** 19
dist = [INFINI] * m
dist[0] = 0
tas = [(0, 0)]
while tas:
    d, r = heapq.heappop(tas)
    if d > dist[r]:
        continue
    for a in pieces:
        v = (r + a) % m
        if d + a < dist[v]:
            dist[v] = d + a
            heapq.heappush(tas, (dist[v], v))

# les montants payables de reste r sont dist[r], dist[r] + m, dist[r] + 2m, ...
total = 0
for r in range(m):
    if dist[r] <= x:
        total += (x - dist[r]) // m + 1
print(total - 1)  # on retire le montant 0
