q = int(input())
for _ in range(q):
    a, b = map(int, input().split())
    total = 0
    p = 1                          # p = 10^k
    for k in range(18):
        # la roue k tourne une fois par multiple de 10^k entre a+1 et b
        total = total + b // p - a // p
        p = p * 10
    print(total)
