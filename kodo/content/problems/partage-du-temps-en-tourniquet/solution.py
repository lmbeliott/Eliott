from collections import deque

n, q = map(int, input().split())
reste = list(map(int, input().split()))   # temps restant de chaque tâche

file = deque(range(n))     # numéros (à partir de 0) des tâches en attente
fin = [0] * n
t = 0
while len(file) > 0:
    i = file.popleft()
    d = min(q, reste[i])
    t = t + d
    reste[i] = reste[i] - d
    if reste[i] == 0:
        fin[i] = t
    else:
        file.append(i)     # retour en fin de file
print(*fin)
