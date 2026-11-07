n = int(input())
v = list(map(int, input().split()))
v.sort()

total = v[0] + v[n - 1]       # le plus faible doit aller avec le plus fort
possible = True
g = 0
d = n - 1
while g < d:
    if v[g] + v[d] != total:
        possible = False
        break
    g = g + 1
    d = d - 1

if possible:
    print(total)
else:
    print("IMPOSSIBLE")
