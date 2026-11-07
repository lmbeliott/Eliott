import json, random
random.seed(2026)

def make(ms):
    return f"{len(ms)}\n" + "".join(f"{m} {e}\n" for m, e in ms)

tests = [make([(2, 0), (1, 1), (3, 2), (0, 1), (0, 0), (4, 0)]), make([(0, 3)])]
tests.append(make([(0, 0)]))
tests.append(make([(1, 0)]))
tests.append(make([(20, 0)] * 1000))
tests.append(make([(0, 20)] * 1000))
tests.append(make([(5, 5)] * 1000))
tests.append(make([(1, 2), (2, 2), (3, 1), (0, 0), (1, 0)]))
tests.append(make([(0, 1), (1, 0)] * 500))
for n in [12, 1000]:
    tests.append(make([(random.randint(0, 5), random.randint(0, 5)) for _ in range(n)]))
tests.append(make([(random.randint(0, 20), random.randint(0, 3)) for _ in range(1000)]))
print(json.dumps(tests))
