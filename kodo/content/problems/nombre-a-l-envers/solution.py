n = int(input())
depart = n                # copie : la boucle va détruire n
r = 0
while n > 0:
    chiffre = n % 10
    r = r * 10 + chiffre  # on ajoute le chiffre à droite de r
    n = n // 10
print(r)
if r == depart:
    print("OUI")
else:
    print("NON")
