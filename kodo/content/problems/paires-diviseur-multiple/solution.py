n = int(input())
t = list(map(int, input().split()))

v = max(t)
f = [0] * (v + 1)   # f[x] : nombre de positions de valeur x
for x in t:
    f[x] += 1

total = 0
for d in range(1, v + 1):
    if f[d] > 0:
        # positions dont la valeur est un multiple de d
        s = 0
        for m in range(d, v + 1, d):
            s += f[m]
        total += f[d] * s
print(total - n)   # retirer les couples (i, i)
