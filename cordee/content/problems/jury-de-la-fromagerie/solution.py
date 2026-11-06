a, b, c = map(int, input().split())

# Une note est au milieu si elle se trouve entre les deux autres.
if b <= a <= c or c <= a <= b:
    print(a)
elif a <= b <= c or c <= b <= a:
    print(b)
else:
    print(c)
