n = int(input())
etapes = 0
plus_grand = n            # la valeur de départ compte
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    etapes = etapes + 1
    if n > plus_grand:
        plus_grand = n
print(etapes, plus_grand)
