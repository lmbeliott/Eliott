n = int(input())
nombres = list(map(int, input().split()))

# On parcourt les positions de n - 1 jusqu'à 0.
for i in range(n - 1, -1, -1):
    print(nombres[i], end=" ")
print()
