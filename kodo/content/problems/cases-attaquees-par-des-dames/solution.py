n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(input())

# Les 8 directions.
di = [-1, -1, -1, 0, 0, 1, 1, 1]
dj = [-1, 0, 1, -1, 1, -1, 0, 1]

attaquee = []
for i in range(n):
    attaquee.append([False] * m)    # une nouvelle ligne à chaque tour

for i in range(n):
    for j in range(m):
        if g[i][j] == "D":
            for d in range(8):
                a = i + di[d]
                b = j + dj[d]
                # Les bornes d'abord, puis le contenu de la case.
                while 0 <= a < n and 0 <= b < m and g[a][b] == ".":
                    attaquee[a][b] = True
                    a = a + di[d]
                    b = b + dj[d]

total = 0
for i in range(n):
    for j in range(m):
        if attaquee[i][j]:
            total = total + 1
print(total)
