n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))

for j in range(m):
    libre = n - 1                   # ligne où se posera la prochaine pierre
    for i in range(n - 1, -1, -1):  # de bas en haut
        if g[i][j] == "#":
            libre = i - 1
        elif g[i][j] == "o":
            g[i][j] = "."           # on retire la pierre avant de la poser
            g[libre][j] = "o"
            libre = libre - 1

for ligne in g:
    print("".join(ligne))
