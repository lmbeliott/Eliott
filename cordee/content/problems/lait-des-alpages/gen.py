import json, random
random.seed(2026)

def test(jours):
    return f"{len(jours)}\n" + "".join(f"{x}\n" for x in jours)

tests = [test([120, 95, 130]), test([50, 0, 75, 100])]
tests.append(test([1000]))
tests.append(test([0]))
tests.append(test([0] * 20))
tests.append(test([1000] * 1000))
tests.append(test([random.randint(0, 1000) for _ in range(1000)]))
tests.append(test([random.randint(0, 1000) for _ in range(500)]))
for _ in range(3):
    n = random.randint(2, 30)
    tests.append(test([random.randint(0, 300) for _ in range(n)]))
print(json.dumps(tests))
