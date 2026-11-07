n, b = map(int, input().split())

# 1. La plus grande puissance de B qui ne dépasse pas N, et le nombre de chiffres.
p = 1
k = 1
while p * b <= n:
    p = p * b
    k = k + 1
print(k)

# 2. Les chiffres, de gauche à droite.
while p > 0:
    print(n // p)
    n = n % p
    p = p // b
