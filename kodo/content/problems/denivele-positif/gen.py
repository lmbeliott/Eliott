import json, random
random.seed(2026)

def test(alt):
    return f"{len(alt)}\n" + " ".join(map(str, alt)) + "\n"

tests = [test([1200, 1500, 1400, 1700, 1650]), test([2000, 1800, 1500])]
tests.append(test([1500]))
tests.append(test([2100, 2100, 2100, 2100]))
tests.append(test([500, 4800]))
tests.append(test([4800, 500, 4800]))
tests.append(test([1000, 1100, 1200, 1300, 1400]))
tests.append(test([4800, 600, 900, 4700, 500]))   # finit plus bas qu'au départ
tests.append(test([500 if i % 2 == 0 else 4800 for i in range(1000)]))
alt = [1500]
for _ in range(999):
    alt.append(min(4800, max(500, alt[-1] + random.randint(-150, 150))))
tests.append(test(alt))
tests.append(test([random.randint(500, 4800) for _ in range(1000)]))
for _ in range(2):
    n = random.randint(5, 20)
    tests.append(test([random.randint(1000, 2500) for _ in range(n)]))
print(json.dumps(tests))
