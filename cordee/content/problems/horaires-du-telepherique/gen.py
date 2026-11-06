import json, random
random.seed(2026)

def hm(m):
    return f"{m // 60:02d}:{m % 60:02d}"

def test(trajets):
    return f"{len(trajets)}\n" + "".join(f"{hm(a)} {hm(b)}\n" for a, b in trajets)

def hasard(n, mini=0, maxi=1439):
    trajets = []
    for _ in range(n):
        a = random.randint(mini, maxi)
        b = random.randint(a, maxi)
        trajets.append((a, b))
    return test(trajets)

tests = [
    test([(8 * 60 + 15, 12 * 60 + 40), (13 * 60 + 30, 17 * 60 + 5)]),
    test([(9 * 60 + 50, 10 * 60 + 5)]),
]
# Cas limites : durée nulle, journée entière, minutes qui « débordent ».
tests.append(test([(600, 600)]))
tests.append(test([(0, 1439)]))
tests.append(test([(0, 0), (1439, 1439), (720, 720)]))
tests.append(test([(7 * 60 + 59, 8 * 60 + 1), (11 * 60 + 58, 12 * 60 + 3)]))
tests.append(test([(9 * 60, 19 * 60)]))
tests.append(test([(6 * 60, 15 * 60 + 59), (8 * 60 + 30, 8 * 60 + 39)]))
# Beaucoup de journées : plus de 100 heures au total.
tests.append(test([(0, 1439)] * 100))
tests.append(hasard(100, 420, 1200))
# Cas aléatoires.
for n in [5, 17, 40, 100]:
    tests.append(hasard(n))
tests.append(hasard(30, 480, 560))
print(json.dumps(tests))
