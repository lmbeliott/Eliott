n, c = map(int, input().split())
x, a, b = map(int, input().split())

p = [x] * n
for i in range(1, n):
    p[i] = (p[i - 1] * a + b) % c
p.sort()

# écarts entre voisins, puis écart de bouclage par la ligne de départ
ecarts = [p[i + 1] - p[i] for i in range(n - 1)]
ecarts.append(c - (p[n - 1] - p[0]))

if min(ecarts[:n - 1]) == 0:
    # des coureurs à la même position : on compte les paires dans chaque bloc
    paires = 0
    i = 0
    while i < n:
        j = i
        while j < n and p[j] == p[i]:
            j = j + 1
        k = j - i
        paires = paires + k * (k - 1) // 2
        i = j
    print(0, paires)
elif n == 2:
    print(min(ecarts[0], c - ecarts[0]), 1)
else:
    d = min(ecarts)
    print(d, ecarts.count(d))
