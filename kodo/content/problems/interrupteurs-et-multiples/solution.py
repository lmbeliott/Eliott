n, k = map(int, input().split())
lampe = [0] * (n + 1)              # lampe[j] : 0 éteinte, 1 allumée (case 0 inutile)
for p in range(1, k + 1):
    for j in range(p, n + 1, p):   # les multiples de p : p, 2p, 3p...
        lampe[j] = 1 - lampe[j]
allumees = 0
for j in range(1, n + 1):
    allumees = allumees + lampe[j]
print(allumees)
