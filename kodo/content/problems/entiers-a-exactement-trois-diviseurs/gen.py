import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{l} {r}\n" for l, r in qs)

grands = [999983, 999979, 999961, 999959, 999953]
tests = [test([(1, 30), (4, 4), (5, 24), (1, 1), (26, 48), (1, 1000000)])]
L = 10**12
qs = [(1, L), (L, L)]
for p in grands:
    qs += [(p * p, p * p), (p * p + 1, L), (p * p - 1, p * p), (1, p * p - 1), (p * p, L)]
qs += [(10**12 - 10**6, 10**12), (999966000289, 999966000289)]
tests.append(test(qs))
tests.append(test([(a, b) for a in range(1, 30, 3) for b in range(a, 60, 7)]))
qs = []
for _ in range(1000):
    a, b = sorted((random.randint(1, L), random.randint(1, L)))
    qs.append((a, b))
tests.append(test(qs))
qs = []
for _ in range(1000):
    a = random.randint(1, L - 10**7)
    qs.append((a, a + random.randint(0, 10**7)))
tests.append(test(qs))
qs = []
for _ in range(1000):
    p = random.choice(grands + [2, 3, 5, 7, 101, 99991])
    qs.append((p * p + random.choice([-1, 0, 1]), p * p + random.choice([0, 1, 10**6])))
tests.append(test([(max(1, a), max(1, a, b)) for a, b in qs]))
print(json.dumps(tests))
