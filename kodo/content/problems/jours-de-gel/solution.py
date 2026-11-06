n = int(input())

# Le compteur commence à 0, avant la boucle.
gel = 0
for i in range(n):
    t = int(input())
    if t < 0:
        gel = gel + 1

print(gel)
