n, m = map(int, input().split())
t = list(map(int, input().split()))
for k in range(m):
    l, r = map(int, input().split())
    i = l - 1            # positions à partir de 1, indices à partir de 0
    j = r - 1
    while i < j:
        t[i], t[j] = t[j], t[i]
        i = i + 1
        j = j - 1
print(*t)
