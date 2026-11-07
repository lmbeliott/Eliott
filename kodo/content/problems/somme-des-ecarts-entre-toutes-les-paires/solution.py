n = int(input())
b = list(map(int, input().split()))
b.sort()

total = 0
deja = 0                  # somme des valeurs b[0], ..., b[j-1]
for j in range(n):
    # paires (i, j) avec i < j : écart b[j] - b[i]
    total = total + j * b[j] - deja
    deja = deja + b[j]
print(total)
