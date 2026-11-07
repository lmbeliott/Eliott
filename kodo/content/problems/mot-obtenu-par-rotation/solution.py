a = input()
b = input()
k = 0
while k < len(a) and a[k:] + a[:k] != b:   # a[k:] + a[:k] : le mot tourné de k crans
    k = k + 1                              # on s'arrête au plus petit k qui convient
if k < len(a):
    print(k)
else:
    print(-1)
