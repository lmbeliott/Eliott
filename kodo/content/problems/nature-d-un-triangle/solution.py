a, b, c = map(int, input().split())
possible = a < b + c and b < a + c and c < a + b
if not possible:
    print("IMPOSSIBLE")
elif a == b and b == c:
    print("EQUILATERAL")
elif a == b or b == c or a == c:
    print("ISOCELE")
else:
    print("QUELCONQUE")
