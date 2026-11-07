n = int(input())
x = 0
y = 0
plus_loin = 0
for i in range(n):
    d, k = input().split()
    k = int(k)
    if d == "N":
        y = y + k
    elif d == "S":
        y = y - k
    elif d == "E":
        x = x + k
    else:
        x = x - k
    # distance |x| + |y|, calculée sans fonction
    ax = x
    if ax < 0:
        ax = -ax
    ay = y
    if ay < 0:
        ay = -ay
    if ax + ay > plus_loin:
        plus_loin = ax + ay
print(x, y, plus_loin)
