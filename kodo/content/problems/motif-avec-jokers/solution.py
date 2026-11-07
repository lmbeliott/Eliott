t = input()
p = input()
n = len(t)
m = len(p)

positions = []
for i in range(n - m + 1):
    # avancer tant que le motif correspond au texte à partir de i
    j = 0
    while j < m and (p[j] == "?" or p[j] == t[i + j]):
        j = j + 1
    if j == m:
        positions.append(str(i + 1))

print(len(positions))
if len(positions) > 0:
    print(" ".join(positions))
