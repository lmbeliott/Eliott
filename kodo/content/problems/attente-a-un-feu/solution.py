v, r = map(int, input().split())
n = int(input())
total = 0
for i in range(n):
    t = int(input())
    p = t % (v + r)               # position dans le cycle du feu
    if p >= v:                    # le feu est rouge
        total = total + (v + r - p)
print(total)
