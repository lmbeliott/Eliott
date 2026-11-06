a = int(input())

# On teste les tranches d'âge dans l'ordre : un seul cas est choisi.
if a < 4:
    print(0)
elif a <= 11:
    print(12)
elif a <= 17:
    print(18)
elif a <= 64:
    print(25)
else:
    print(20)
