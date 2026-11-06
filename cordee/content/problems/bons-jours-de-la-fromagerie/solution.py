n = int(input())
prod = list(map(int, input().split()))

# Premier parcours : la somme de toutes les productions.
s = 0
for x in prod:
    s = s + x

# Second parcours : x > s / n s'écrit sans division x * n > s.
bons = 0
for x in prod:
    if x * n > s:
        bons = bons + 1

print(bons)
