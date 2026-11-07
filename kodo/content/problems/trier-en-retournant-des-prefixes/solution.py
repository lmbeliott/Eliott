import sys
from collections import deque

donnees = sys.stdin.read().split()
n, q = int(donnees[0]), int(donnees[1])

# parcours en largeur depuis la liste triée ; un état est une chaîne comme "2143"
triee = "".join(str(i) for i in range(1, n + 1))
dist = {triee: 0}
file = deque([triee])
while file:
    s = file.popleft()
    for k in range(2, n + 1):
        t = s[:k][::-1] + s[k:]        # retourner les k premiers éléments
        if t not in dist:
            dist[t] = dist[s] + 1
            file.append(t)

reponses = []
pos = 2
for _ in range(q):
    s = "".join(donnees[pos:pos + n])
    pos += n
    reponses.append(dist[s])
print("\n".join(map(str, reponses)))
