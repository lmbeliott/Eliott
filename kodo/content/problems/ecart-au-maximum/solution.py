n = int(input())
t = list(map(int, input().split()))
m = t[0]                 # premier passage : le maximum
for x in t:
    if x > m:
        m = x
ecarts = []              # second passage : les écarts
for x in t:
    ecarts.append(m - x)
print(*ecarts)
