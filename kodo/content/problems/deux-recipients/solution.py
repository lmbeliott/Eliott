from collections import deque

a, b, c = map(int, input().split())

def suivants(x, y):
    # les 6 opérations possibles depuis l'état (x, y)
    v = min(x, b - y)                 # versement du premier dans le second
    w = min(y, a - x)                 # versement du second dans le premier
    return [(a, y), (x, b), (0, y), (x, 0), (x - v, y + v), (x + w, y - w)]

dist = {(0, 0): 0}                    # seuls les états atteints sont stockés
file = deque([(0, 0)])
reponse = -1
while file:
    x, y = file.popleft()
    if x == c or y == c:
        reponse = dist[(x, y)]
        break
    for etat in suivants(x, y):
        if etat not in dist:
            dist[etat] = dist[(x, y)] + 1
            file.append(etat)
print(reponse)
