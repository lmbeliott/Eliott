n, k = map(int, input().split())
a = list(map(int, input().split()))

vus = {0: 1}        # reste -> nombre de préfixes déjà vus avec ce reste (P[0] = 0)
p = 0
total = 0
for x in a:
    p = p + x
    r = p % k       # en Python, toujours entre 0 et k - 1
    total = total + vus.get(r, 0)
    vus[r] = vus.get(r, 0) + 1
print(total)
