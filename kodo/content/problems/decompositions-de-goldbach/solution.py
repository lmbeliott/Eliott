def est_premier(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True


def goldbach(n):
    # q = n - p est déterminé par p, et p <= q revient à p <= n / 2.
    total = 0
    for p in range(2, n // 2 + 1):
        if est_premier(p) and est_premier(n - p):
            total = total + 1
    return total


q = int(input())
for i in range(q):
    print(goldbach(int(input())))
