import json, random
random.seed(2026)

def test(l, r):
    return f"{l} {r}\n"

T = 10**12
tests = [
    test(1, 30),
    test(100, 130),
    test(1, 1),                       # 1 n'est pas premier
    test(2, 2),
    test(24, 28),                     # aucun premier
    test(1, 1000),
    test(999999999989, 999999999989), # le plus grand premier inférieur à 10^12
    test(T, T),
    test(2, 1000000),                 # les petits premiers sont dans la fenêtre
    test(10**9, 10**9 + 1000),
]
debut = random.randint(10**10, 10**11)
tests.append(test(debut, debut + 300000))
# tailles maximales : fenêtres d'un million de nombres autour de 10^12
for l in [T - 10**6, 999_000_000_000, random.randint(5 * 10**11, T - 10**6)]:
    tests.append(test(l, l + 10**6))
print(json.dumps(tests))
