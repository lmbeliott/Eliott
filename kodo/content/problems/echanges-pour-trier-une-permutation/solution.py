n = int(input())
a = [0] + list(map(int, input().split()))   # positions numérotées de 1 à n

pos = [0] * (n + 1)      # pos[v] = position actuelle de la valeur v
for p in range(1, n + 1):
    pos[a[p]] = p

echanges = 0
for i in range(1, n + 1):
    # invariant : les positions 1 à i-1 contiennent déjà 1 à i-1
    if a[i] != i:
        j = pos[i]                 # là où se trouve la valeur i
        v = a[i]
        a[i], a[j] = i, v
        pos[i], pos[v] = i, j
        echanges = echanges + 1
print(echanges)
