n = int(input())
a = sorted(map(int, input().split()))

total = 0
for k in range(2, n):            # a[k] est le plus grand côté
    i = 0
    j = k - 1
    while i < j:
        if a[i] + a[j] > a[k]:
            total = total + (j - i)    # a[i..j-1] conviennent tous avec a[j]
            j = j - 1
        else:
            i = i + 1                  # a[i] ne convient avec aucun élément restant
print(total)
