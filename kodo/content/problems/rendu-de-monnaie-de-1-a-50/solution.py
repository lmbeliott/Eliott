total = 0
for m in range(1, 51):
    # La plus grosse pièce d'abord : quotient et reste à chaque étape.
    dix = m // 10
    reste = m % 10
    cinq = reste // 5
    reste = reste % 5
    deux = reste // 2
    un = reste % 2
    pieces = dix + cinq + deux + un
    print(m, pieces)
    total = total + pieces
print(total)
