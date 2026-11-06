def en_minutes(horaire):
    # "08:45" -> 8 * 60 + 45 = 525
    heures = int(horaire[0:2])
    minutes = int(horaire[3:5])
    return heures * 60 + minutes


def deux_chiffres(n):
    # 7 -> "07", 45 -> "45", 123 -> "123"
    if n < 10:
        return "0" + str(n)
    return str(n)


def en_texte(duree):
    # 525 -> "08:45"
    return deux_chiffres(duree // 60) + ":" + deux_chiffres(duree % 60)


n = int(input())
total = 0
for _ in range(n):
    debut, fin = input().split()
    total += en_minutes(fin) - en_minutes(debut)

print(en_texte(total))
