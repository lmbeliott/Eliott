n, a, b = map(int, input().split())

# pos[v] = position de la valeur v dans la liste (v de 1 à n)
pos = [0] * (n + 2)
for i in range(n):
    pos[(a * i + b) % n + 1] = i

total = 0
# pour chaque x : prochaine valeur z > x avec pos[z] < pos[x]
pile = []
suivant = [n + 1] * (n + 1)
for v in range(1, n + 1):
    while pile and pos[pile[-1]] > pos[v]:
        suivant[pile.pop()] = v
    pile.append(v)
# pour chaque y : dernière valeur w < y avec pos[w] < pos[y]
pile = []
precedent = [0] * (n + 1)
for v in range(n, 0, -1):
    while pile and pos[pile[-1]] > pos[v]:
        precedent[pile.pop()] = v
    pile.append(v)

for v in range(1, n + 1):
    total += (suivant[v] - v - 1) + (v - precedent[v] - 1)
print(total)
