import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{n} {k}\n" for n, k in qs)

M = 10**18
tests = [test([(13, 2), (13, 6), (13, 13)]), test([(100, 3), (100, 100), (1, 1), (9, 9)])]
tests.append(test([(M, 1), (M, M), (M, 2), (M, 19), (M, 20), (M - 1, M - 1)]))
qs = []
for _ in range(1000):
    n = random.randint(1, M)
    qs.append((n, random.randint(1, n)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    n = random.randint(1, 3000)
    qs.append((n, random.randint(1, n)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    n = 10**random.randint(0, 18) + random.choice([-1, 0, 1, 7])
    n = max(1, min(M, n))
    qs.append((n, random.choice([1, n, random.randint(1, n), max(1, n - 1)])))
tests.append(test(qs))
qs = []
for _ in range(1000):
    n = random.randint(1, M)
    qs.append((n, max(1, n - random.randint(0, 100))))
tests.append(test(qs))
print(json.dumps(tests))
