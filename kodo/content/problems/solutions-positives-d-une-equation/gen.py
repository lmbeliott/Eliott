import json, random
random.seed(2026)

G = 10**9
L = 10**18

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b} {c}\n" for a, b, c in qs)

tests = [test([(4, 6, 24), (4, 6, 25), (3, 5, 7), (2, 2, 0), (1, 1, 10), (5, 3, 1)])]
qs = [(1, 1, L), (1, 2, L), (G, G, L), (G, G - 1, L), (G - 1, G, L - 1), (999999937, 999999929, L), (2, 4, L - 1),
      (G, 1, 0), (1, G, 999999999), (6, 10, 15), (6, 10, 16), (123456, 7890, L)]
tests.append(test(qs))
tests.append(test([(a, b, c) for a in range(1, 6) for b in range(1, 6) for c in range(0, 30, 3)]))
tests.append(test([(random.randint(1, G), random.randint(1, G), random.randint(0, L)) for _ in range(1000)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 1000), random.randint(0, L)) for _ in range(1000)]))
qs = []
for _ in range(1000):
    g = random.choice([1, 2, 6, 1000, random.randint(1, 10**4)])
    a, b = g * random.randint(1, G // g), g * random.randint(1, G // g)
    c = g * random.randint(0, L // g) if random.random() < 0.8 else random.randint(0, L)
    qs.append((a, b, c))
tests.append(test(qs))
print(json.dumps(tests))
