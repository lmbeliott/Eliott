LIMITE = 10**18

# tous les entiers 2^a * 3^b au plus égaux à 10^18
nombres = []
p = 1
while p <= LIMITE:
    x = p
    while x <= LIMITE:
        nombres.append(x)
        x = x * 3
    p = p * 2

q = int(input())
for _ in range(q):
    a, b = map(int, input().split())
    compte = 0
    for x in nombres:
        if a <= x <= b:
            compte = compte + 1
    print(compte)
