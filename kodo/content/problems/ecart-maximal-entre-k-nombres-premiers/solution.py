from bisect import bisect_left

a, b, k = map(int, input().split())

# crible d'Ératosthène jusqu'à B
est_premier = bytearray([1]) * (b + 1)
est_premier[0] = 0
if b >= 1:
    est_premier[1] = 0
i = 2
while i * i <= b:
    if est_premier[i]:
        est_premier[i * i::i] = bytearray(len(range(i * i, b + 1, i)))
    i += 1
premiers = [p for p in range(a, b + 1) if est_premier[p]]


def possible(d):
    # glouton : on prend le premier nombre premier, puis toujours le plus petit à distance au moins d
    pris, idx = 1, 0
    while pris < k:
        idx = bisect_left(premiers, premiers[idx] + d, idx + 1)
        if idx == len(premiers):
            return False
        pris += 1
    return True


if len(premiers) < k:
    print(-1)
else:
    bas, haut = 1, b - a  # possible(bas) est vrai ; on cherche le plus grand d possible
    while bas < haut:
        milieu = (bas + haut + 1) // 2
        if possible(milieu):
            bas = milieu
        else:
            haut = milieu - 1
    print(bas)
