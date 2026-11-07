n = int(input())
t = list(map(int, input().split()))
vu = [False] * (n + 1)       # la réponse est entre 0 et n
for x in t:
    if x <= n:
        vu[x] = True
v = 0
while vu[v]:                 # s'arrête au plus tard en v = n
    v = v + 1
print(v)
