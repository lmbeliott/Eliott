n, k = map(int, input().split())
t = list(map(int, input().split()))

k = k % n   # entre 0 et n - 1, même si k est négatif
r = [0] * n
for i in range(n):
    r[(i + k) % n] = t[i]
print(" ".join(map(str, r)))
