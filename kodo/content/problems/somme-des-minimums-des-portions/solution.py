n = int(input())
a = list(map(int, input().split()))

# g[i] : position la plus proche à gauche avec une valeur <= a[i] (ou -1)
g = [0] * n
pile = []
for i in range(n):
    while len(pile) > 0 and a[pile[-1]] > a[i]:
        pile.pop()
    g[i] = pile[-1] if len(pile) > 0 else -1
    pile.append(i)

# d[i] : position la plus proche à droite avec une valeur < a[i] (ou n)
d = [0] * n
pile = []
for i in range(n - 1, -1, -1):
    while len(pile) > 0 and a[pile[-1]] >= a[i]:
        pile.pop()
    d[i] = pile[-1] if len(pile) > 0 else n
    pile.append(i)

total = 0
for i in range(n):
    # a[i] est le minimum (le plus à gauche) de (i - g[i]) * (d[i] - i) portions
    total = total + a[i] * (i - g[i]) * (d[i] - i)
print(total)
