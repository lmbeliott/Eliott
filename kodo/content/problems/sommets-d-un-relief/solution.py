def est_sommet(g, i, j):
    n = len(g)
    m = len(g[0])
    for a in range(-1, 2):
        for b in range(-1, 2):
            ni = i + a
            nj = j + b
            # (a, b) = (0, 0) désigne la case elle-même : on l'ignore.
            if (a != 0 or b != 0) and 0 <= ni < n and 0 <= nj < m:
                if g[ni][nj] >= g[i][j]:
                    return False
    return True


n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(input())
total = 0
for i in range(n):
    for j in range(m):
        if est_sommet(g, i, j):
            total = total + 1
print(total)
