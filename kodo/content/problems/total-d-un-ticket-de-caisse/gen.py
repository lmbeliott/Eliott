import json, random
random.seed(2026)

def make(lines):
    return f"{len(lines)}\n" + "".join(f"{q} {p}\n" for q, p in lines)

tests = [make([(3, 250), (1, 1200), (2, 99)]), make([(1, 1)])]
tests.append(make([(100, 10000)] * 1000))
tests.append(make([(1, 1)] * 1000))
tests.append(make([(100, 1), (1, 10000)]))
tests.append(make([(7, 10000)]))
for n in [5, 50, 500, 1000]:
    tests.append(make([(random.randint(1, 100), random.randint(1, 10000)) for _ in range(n)]))
print(json.dumps(tests))
