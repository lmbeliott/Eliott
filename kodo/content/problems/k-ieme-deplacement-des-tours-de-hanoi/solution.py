def trouver(n, a, b, c, k):
    # k-ième étape du déplacement d'une tour de n disques de a vers b (en se servant de c)
    m = 2 ** (n - 1)
    if k == m:
        return n, a, b
    if k < m:
        return trouver(n - 1, a, c, b, k)
    return trouver(n - 1, c, b, a, k - m)

n, q = map(int, input().split())
for _ in range(q):
    k = int(input())
    disque, depart, arrivee = trouver(n, 1, 3, 2, k)
    print(disque, depart, arrivee)
