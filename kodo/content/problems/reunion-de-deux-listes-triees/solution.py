n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))

resultat = []
i = 0
j = 0
while i < n or j < m:
    # la plus petite valeur restante est a[i] ou b[j]
    if j == m or (i < n and a[i] <= b[j]):
        x = a[i]
        i += 1
    else:
        x = b[j]
        j += 1
    if len(resultat) == 0 or resultat[-1] != x:   # les copies sont consécutives
        resultat.append(x)

print(len(resultat))
print(" ".join(map(str, resultat)))
