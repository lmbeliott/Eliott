n = int(input())

# k = partie entière de la racine carrée de n
k = int(n ** 0.5)
while (k + 1) * (k + 1) <= n:
    k = k + 1
while k * k > n:
    k = k - 1

a_petit = 0            # nombre de couples avec a <= k
for a in range(1, k + 1):
    a_petit = a_petit + n // a

print(2 * a_petit - k * k)
