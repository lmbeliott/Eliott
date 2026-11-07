def compter(n, c):
    # nombre d'apparitions du chiffre c dans l'écriture de 1, 2, ..., n
    total = 0
    p = 1
    while p <= n:
        haut = n // (10 * p)
        d = (n // p) % 10
        bas = n % p
        if c == 0:
            if haut >= 1:
                total = total + (haut - 1) * p      # parties hautes de 1 à haut - 1
                if d > 0:
                    total = total + p
                else:
                    total = total + bas + 1
        else:
            total = total + haut * p                # parties hautes de 0 à haut - 1
            if c < d:
                total = total + p
            elif c == d:
                total = total + bas + 1
        p = p * 10
    return total

q = int(input())
for _ in range(q):
    n, c = map(int, input().split())
    print(compter(n, c))
