n = int(input())
altitudes = list(map(int, input().split()))

# On parcourt les positions de n - 1 jusqu'à 0.
for i in range(n - 1, -1, -1):
    print(altitudes[i], end=" ")
print()
