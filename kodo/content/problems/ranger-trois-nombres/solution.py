a, b, c = map(int, input().split())
# Trois échanges suffisent pour ranger trois nombres.
if a > b:
    t = a
    a = b
    b = t
if b > c:
    t = b
    b = c
    c = t
# c contient maintenant le plus grand ; on range a et b.
if a > b:
    t = a
    a = b
    b = t
print(a, b, c)
