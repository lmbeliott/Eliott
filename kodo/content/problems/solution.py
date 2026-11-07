n = int(input())
x, b, c, m = map(int, input().split())
a = [x] * n
for i in range(1, n):
    a[i] = (a[i - 1] * b + c) % m

total = 0
pile = []     # indices dont les valeurs sont strictement croissantes
for i in range(n + 1):
    # la position n joue le rôle d'une valeur plus petite que tout : elle vide la pile
    while pile and (i == n or a[pile[-1]] >= a[i]):
        j = pile.pop()
        g = pile[-1] if pile else -1      # dernière position avant j de valeur < a[j]
        d = i                             # première position après j de valeur <= a[j]
        total = total + a[j] * (j - g) * (d - j)
    pile.append(i)
print(total)
