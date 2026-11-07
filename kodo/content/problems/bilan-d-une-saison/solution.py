n = int(input())
points = 0
serie = 0
record = 0
nettes = 0
for i in range(n):
    m, e = map(int, input().split())
    victoire = m > e
    defaite = m < e
    if victoire:
        points = points + 3
    elif not defaite:
        points = points + 1
    # Série sans défaite : un nul la prolonge aussi.
    if not defaite:
        serie = serie + 1
        if serie > record:
            record = serie
    else:
        serie = 0
    if victoire and e == 0:
        nettes = nettes + 1
print(points)
print(record)
print(nettes)
