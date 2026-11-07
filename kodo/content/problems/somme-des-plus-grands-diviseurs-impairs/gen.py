import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{l} {r}\n" for l, r in qs)

N = 10**9
tests = [test([(1, 6), (12, 12), (7, 8)]), test([(1, 1), (1, 100), (50, 60)])]
tests.append(test([(1, N), (N, N), (1, 1)]))
tests.append(test([(2**29, 2**29), (2**29 - 1, 2**29 + 1), (536870912, 999999999)]))
qs = []
for _ in range(1000):
    l = random.randint(1, N)
    qs.append((l, random.randint(l, N)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    l = random.randint(1, 5000)
    qs.append((l, random.randint(l, 5000)))
tests.append(test(qs))
tests.append(test([(random.randint(1, 1000), random.randint(N - 1000, N)) for _ in range(1000)]))
print(json.dumps(tests))
