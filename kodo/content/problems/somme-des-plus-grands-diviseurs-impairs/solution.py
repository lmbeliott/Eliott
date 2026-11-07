def F(n):
    # g(1) + g(2) + ... + g(n)
    if n == 0:
        return 0
    m = (n + 1) // 2            # nombre d'impairs entre 1 et n
    return m * m + F(n // 2)

q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(F(r) - F(l - 1))
