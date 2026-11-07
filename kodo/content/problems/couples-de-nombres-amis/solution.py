n = int(input())

# s[m] = somme des diviseurs de m strictement plus petits que m
s = [0] * (n + 1)
for d in range(1, n // 2 + 1):
    for m in range(2 * d, n + 1, d):    # d divise 2d, 3d, 4d...
        s[m] = s[m] + d

couples = []
for a in range(2, n + 1):
    b = s[a]
    if a < b <= n and s[b] == a:
        couples.append((a, b))

print(len(couples))
for a, b in couples:
    print(a, b)
