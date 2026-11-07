n, k = map(int, input().split())
nombre = 0
for i in range(1, n + 1):
    for j in range(i + 1, n + 1):     # j > i : chaque paire une seule fois
        if (i + j) % k == 0:
            nombre = nombre + 1
print(nombre)
