n, s = map(int, input().split())
x, b, c, m = map(int, input().split())

a = [x] * n
for i in range(1, n):
    a[i] = (a[i - 1] * b + c) % m
a.sort()

paires = 0
g = 0
d = n - 1
while g < d:
    if a[g] + a[d] <= s:
        paires = paires + (d - g)   # a[g] avec a[g+1], ..., a[d]
        g = g + 1
    else:
        d = d - 1                   # a[d] ne forme plus aucune paire
print(paires)
