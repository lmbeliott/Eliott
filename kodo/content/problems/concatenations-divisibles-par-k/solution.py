def compter(posees, r):
    # nombre de façons de terminer la pose avec un multiple de K,
    # sachant que le nombre déjà formé a pour reste r
    if posees == n:
        if r == 0:
            return 1
        return 0
    total = 0
    for i in range(n):
        if not utilisee[i]:
            utilisee[i] = True
            total = total + compter(posees + 1, (r * p[i] + x[i]) % k)
            utilisee[i] = False
    return total

n, k = map(int, input().split())
x = list(map(int, input().split()))
p = []                      # p[i] = 10^(nombre de chiffres de x[i]) modulo k
for v in x:
    p.append(10 ** len(str(v)) % k)
utilisee = [False] * n
print(compter(0, 0))
