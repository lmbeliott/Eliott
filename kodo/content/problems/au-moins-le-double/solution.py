from bisect import bisect_left

n, x, b, c, m = map(int, input().split())
a = [0] * n
a[0] = x
for i in range(1, n):
    a[i] = (a[i - 1] * b + c) % m
a.sort()

paires = 0
for i in range(n):
    # premier indice p tel que a[p] >= 2 * a[i]
    p = bisect_left(a, 2 * a[i])
    paires += n - max(p, i + 1)
print(paires)
