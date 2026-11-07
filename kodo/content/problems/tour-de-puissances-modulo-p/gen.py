import json, random
random.seed(2026)

P = 1000000007
L = 10**18

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b} {c}\n" for a, b, c in qs)

tests = [test([(2, 3, 2), (3, 2, 3), (0, 0, 0), (0, 5, 0), (0, 0, 7), (7, 0, 3), (5, 1, 0), (10, 10, 1)])]
qs = [(P, 1, 1), (P, 0, 1), (P, 0, 0), (2 * P, 3, 0), (P - 1, P - 1, 1), (2, P - 1, 1), (2, P - 1, L), (3, 2 * (P - 1), 5),
      (L, L, L), (L, 0, L), (0, L, L), (1, L, L), (P + 1, L, L), (2, 2, 60), (2, 2, 61), (L - L % P, 7, 7)]
tests.append(test(qs))
tests.append(test([(a, b, c) for a in range(4) for b in range(4) for c in range(4)]))
tests.append(test([(random.randint(0, L), random.randint(0, L), random.randint(0, L)) for _ in range(1000)]))
qs = []
for _ in range(1000):
    a = random.choice([0, P, 3 * P, random.randint(0, L), random.randint(0, 10)])
    b = random.choice([0, 1, P - 1, 2 * (P - 1), random.randint(0, L), random.randint(0, 10)])
    c = random.choice([0, 1, random.randint(0, L), random.randint(0, 10)])
    qs.append((a, b, c))
tests.append(test(qs))
print(json.dumps(tests))
