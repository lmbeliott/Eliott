t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    carres = 0
    while b != 0:
        # on découpe a // b carrés de côté b, il reste une feuille b × (a % b)
        carres += a // b
        a, b = b, a % b
    print(carres, a)
