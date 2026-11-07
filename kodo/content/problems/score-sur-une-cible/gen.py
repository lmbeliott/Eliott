import json, random
random.seed(2026)

def test(shots):
    return f"{len(shots)}\n" + "".join(f"{x} {y}\n" for x, y in shots)

tests = [test([(0, 0), (6, 8), (15, 15), (-30, 40), (60, 0)]), test([(100, 100), (-12, 5)])]
tests.append(test([(0, 0)]))
tests.append(test([(-100, -100)]))
tests.append(test([(10, 0), (0, -20), (18, 24), (0, 40), (-30, -40)]))   # tous sur un bord
tests.append(test([(10, 1), (0, -21), (18, 25), (0, 41), (-30, -41)]))  # juste à l'extérieur
tests.append(test([(0, 0)] * 1000))
for n in [10, 200, 1000, 1000]:
    tests.append(test([(random.randint(-60, 60), random.randint(-60, 60)) for _ in range(n)]))
tests.append(test([(random.randint(-100, 100), random.randint(-100, 100)) for _ in range(1000)]))
print(json.dumps(tests))
