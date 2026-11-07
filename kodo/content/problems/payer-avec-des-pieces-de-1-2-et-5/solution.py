n = int(input())

total = 0
# A est le nombre de pièces de 5.
for a in range(n // 5 + 1):
    reste = n - 5 * a
    # Pour payer le reste avec des 2 et des 1 : de 0 à reste // 2 pièces de 2.
    total = total + reste // 2 + 1

print(total)
