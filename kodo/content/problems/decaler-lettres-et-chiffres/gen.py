import json, random
random.seed(2026)

AUTRES = ".,;:!?'()-"

def texte_aleatoire(n, lettres=True):
    car = []
    for i in range(n):
        x = random.random()
        if x < 0.12 and i > 0 and i < n - 1 and car[-1] != " ":
            car.append(" ")
        elif x < 0.5:
            car.append(chr(ord("a") + random.randint(0, 25)))
        elif x < 0.7:
            car.append(chr(ord("A") + random.randint(0, 25)))
        elif x < 0.9:
            car.append(str(random.randint(0, 9)))
        else:
            car.append(random.choice(AUTRES))
    return "".join(car)

def test(k, texte):
    return f"{k}\n{texte}\n"

tests = [test(3, "Rendez-vous a 9h, salle B12 !"), test(-1, "abz AZ 0 9")]
tests.append(test(0, "Rien ne change: 2026."))
tests.append(test(26, "Zebre 10"))                    # un tour complet pour les lettres, pas pour les chiffres
tests.append(test(-27, "aAbB0"))
tests.append(test(10**9, "xyz XYZ 789"))
tests.append(test(-10**9, "Bonjour 2026"))
tests.append(test(130, "Tout revient au depart 0123456789"))
tests.append(test(7, "?"))
for k in [random.randint(-50, 50), random.randint(-10**9, 10**9)]:
    tests.append(test(k, texte_aleatoire(60)))
# grands tests : répéter |K| fois un décalage d'un cran serait trop lent
tests.append(test(10**9 - 1, texte_aleatoire(100000)))
tests.append(test(-999999937, texte_aleatoire(100000)))
tests.append(test(123456789, "z9Z" * 33333 + "a"))
print(json.dumps(tests))
