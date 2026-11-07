x1, y1, x2, y2 = map(int, input().split())
x, y = map(int, input().split())
dedans_large = x1 <= x and x <= x2 and y1 <= y and y <= y2
dedans_strict = x1 < x and x < x2 and y1 < y and y < y2
if dedans_strict:
    print("DEDANS")
elif dedans_large:
    print("BORD")
else:
    print("DEHORS")
