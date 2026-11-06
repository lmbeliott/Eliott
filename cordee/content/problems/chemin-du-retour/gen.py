import json, random
random.seed(2026)

def test(alt):
    return f"{len(alt)}\n" + " ".join(map(str, alt)) + "\n"

tests = [test([1200, 1450, 1600, 1890, 2100]), test([1700, 1650, 1820, 1790])]
tests.append(test([1500]))
tests.append(test([0, 4800]))
tests.append(test([2000, 2000, 2000]))
tests.append(test(list(range(1000, 1010))))
tests.append(test([random.randint(0, 4800) for _ in range(1000)]))
tests.append(test(sorted(random.randint(800, 2600) for _ in range(1000))))
for _ in range(3):
    n = random.randint(2, 20)
    tests.append(test([random.randint(500, 3000) for _ in range(n)]))
print(json.dumps(tests))
