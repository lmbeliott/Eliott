n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))

meilleur = abs(a[0] - b[0])
i = 0
j = 0
while i < n and j < m:
    meilleur = min(meilleur, abs(a[i] - b[j]))
    # la plus petite des deux ne peut pas faire mieux avec les valeurs restantes
    if a[i] < b[j]:
        i += 1
    else:
        j += 1
print(meilleur)
