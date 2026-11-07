a = int(input())
# Les règles les plus particulières d'abord.
if a % 400 == 0:
    print("OUI")
elif a % 100 == 0:
    print("NON")
elif a % 4 == 0:
    print("OUI")
else:
    print("NON")
