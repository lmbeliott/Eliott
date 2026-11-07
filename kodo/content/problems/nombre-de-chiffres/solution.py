n = int(input())
if n == 0:
    print(1)              # 0 s'écrit avec un chiffre
else:
    chiffres = 0
    while n > 0:
        n = n // 10       # on enlève le dernier chiffre
        chiffres = chiffres + 1
    print(chiffres)
