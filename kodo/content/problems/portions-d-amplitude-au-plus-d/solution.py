from collections import deque

n, d = map(int, input().split())
x, b, c, m = map(int, input().split())
a = [x] * n
for i in range(1, n):
    a[i] = (a[i - 1] * b + c) % m

dmax = deque()     # indices de la fenêtre, valeurs strictement décroissantes
dmin = deque()     # indices de la fenêtre, valeurs strictement croissantes
g = 0
total = 0
for j in range(n):
    while dmax and a[dmax[-1]] <= a[j]:
        dmax.pop()
    dmax.append(j)
    while dmin and a[dmin[-1]] >= a[j]:
        dmin.pop()
    dmin.append(j)
    # on raccourcit la fenêtre tant que son amplitude dépasse d
    while a[dmax[0]] - a[dmin[0]] > d:
        g = g + 1
        if dmax[0] < g:
            dmax.popleft()
        if dmin[0] < g:
            dmin.popleft()
    total = total + (j - g + 1)
print(total)
