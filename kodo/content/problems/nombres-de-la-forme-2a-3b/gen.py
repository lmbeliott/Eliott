import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b}\n" for a, b in qs)

M = 10**18
tests = [test([(1, 10), (5, 5), (100, 200)]), test([(1, 1), (27, 27), (1, 1000000)])]
tests.append(test([(1, M)]))
tests.append(test([(M, M), (2**59, 2**59), (3**37, 3**37), (2**59 + 1, M), (5, 5)]))
qs = []
for _ in range(1000):
    a = random.randint(1, M)
    qs.append((a, random.randint(a, M)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    e = random.randint(0, 18)
    a = random.randint(1, 10**e)
    qs.append((a, min(M, a * random.randint(1, 50))))
tests.append(test(qs))
qs = []
for _ in range(1000):
    x = 2**random.randint(0, 30) * 3**random.randint(0, 18)
    qs.append(random.choice([(x, x), (x + 1, x * 2 - 1), (x, x * 3), (max(1, x - 1), x - 1 if x > 1 else 1)]))
tests.append(test(qs))
print(json.dumps(tests))
