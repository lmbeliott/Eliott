a, b = map(int, input().split())
# On retire le plus petit du plus grand.
if a >= b:
    print(a - b)
else:
    print(b - a)
