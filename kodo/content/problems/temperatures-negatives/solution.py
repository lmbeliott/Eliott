n = int(input())

# Le compteur commence à 0, avant la boucle.
negatifs = 0
for i in range(n):
    t = int(input())
    if t < 0:
        negatifs = negatifs + 1

print(negatifs)
