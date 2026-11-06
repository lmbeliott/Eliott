n = int(input())
alt = list(map(int, input().split()))

total = 0
# On compare chaque point avec le précédent : i commence à 1.
for i in range(1, n):
    if alt[i] > alt[i - 1]:
        total = total + (alt[i] - alt[i - 1])

print(total)
