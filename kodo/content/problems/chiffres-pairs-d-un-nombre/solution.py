n = int(input())

if n == 0:
    # Le nombre 0 s'écrit avec un seul chiffre, qui est pair.
    print(1)
else:
    pairs = 0
    while n > 0:
        chiffre = n % 10      # le dernier chiffre
        if chiffre % 2 == 0:
            pairs = pairs + 1
        n = n // 10           # on enlève le dernier chiffre
    print(pairs)
