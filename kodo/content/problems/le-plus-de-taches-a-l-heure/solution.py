import sys
import heapq

donnees = sys.stdin.read().split()
n = int(donnees[0])
taches = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]
taches.sort(key=lambda t: t[1])         # par date limite croissante

acceptees = []          # durées acceptées, avec un signe moins (heapq donne le minimum)
total = 0
for p, d in taches:
    heapq.heappush(acceptees, -p)
    total += p
    if total > d:                       # en retard : on abandonne la plus longue
        total += heapq.heappop(acceptees)
print(len(acceptees))
