n = int(input())
c = list(map(int, input().split()))

operations = 0
for i in range(n - 1):
    q = c[i] // 2        # toutes les opérations possibles dans la boîte i, d'un coup
    operations += q
    c[i] -= 2 * q
    c[i + 1] += q
print(operations)
print(" ".join(map(str, c)))
