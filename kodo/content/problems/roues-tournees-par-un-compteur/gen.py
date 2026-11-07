import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b}\n" for a, b in qs)

M = 10**18 - 1
tests = [test([(1299, 1300), (1300, 1301), (1299, 1301)]), test([(0, 10), (0, 100), (95, 105), (7, 7)])]
tests.append(test([(0, 0)]))
tests.append(test([(0, M), (M, M), (M - 1, M), (99999999999999999, 100000000000000000)]))
tests.append(test([(0, 10**17), (10**17, 2 * 10**17), (123456789, 987654321)]))
qs = []
for _ in range(1000):
    a = random.randint(0, M)
    b = random.randint(a, M)
    qs.append((a, b))
tests.append(test(qs))
qs = []
for _ in range(1000):
    a = random.randint(0, 10**6)
    qs.append((a, a + random.randint(0, 2000)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    k = random.randint(1, 17)
    a = random.randint(1, 10**(18 - k) - 1) * 10**k - random.randint(1, 3)
    qs.append((a, min(M, a + random.randint(1, 10))))
tests.append(test(qs))
tests.append(test([(random.randint(0, 10**9), random.randint(10**17, M)) for _ in range(1000)]))
print(json.dumps(tests))
