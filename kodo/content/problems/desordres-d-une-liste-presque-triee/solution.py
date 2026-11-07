n = int(input())
a = list(map(int, input().split()))

echanges = 0
for i in range(1, n):
    # insertion de a[i] dans la partie déjà triée a[0..i-1]
    j = i
    while j > 0 and a[j - 1] > a[j]:
        a[j - 1], a[j] = a[j], a[j - 1]
        echanges = echanges + 1      # chaque échange supprime exactement un désordre
        j = j - 1
print(echanges)
