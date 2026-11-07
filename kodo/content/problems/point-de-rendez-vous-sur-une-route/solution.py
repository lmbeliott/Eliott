n = int(input())
x = list(map(int, input().split()))

x.sort()
p = x[(n - 1) // 2]       # la médiane (la plus petite des deux du milieu si n est pair)
total = 0
for v in x:
    total = total + abs(v - p)
print(p, total)
