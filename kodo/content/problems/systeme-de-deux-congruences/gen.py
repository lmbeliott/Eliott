import json, random
random.seed(2026)

G = 10**9

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a1} {m1} {a2} {m2}\n" for a1, m1, a2, m2 in qs)

tests = [test([(2, 3, 3, 5), (1, 4, 2, 6), (1, 4, 3, 6), (0, 1, 0, 1), (5, 7, 5, 7), (0, 10, 4, 12)])]
qs = [(G - 1, G, G - 2, G - 1), (999999936, 999999937, 999999928, 999999929), (0, G, 0, G), (G - 1, G, 1, 2),
      (G - 1, G, 0, 2), (123, 1000, 456, 1000), (7, 2 ** 29, 3, 3 ** 18), (0, 1, G - 1, G)]
tests.append(test(qs))
tests.append(test([(a1, m1, a2, m2) for m1 in range(1, 7) for m2 in range(1, 7) for a1 in range(m1) for a2 in range(m2)][:1000]))
tests.append(test([(random.randrange(m1), m1, random.randrange(m2), m2) for m1, m2 in [(random.randint(1, G), random.randint(1, G)) for _ in range(1000)]]))
qs = []
for _ in range(1000):
    g = random.choice([1, 2, 12, 1000, random.randint(1, 10**5)])
    m1, m2 = g * random.randint(1, G // g), g * random.randint(1, G // g)
    x = random.randint(0, 10**18)
    if random.random() < 0.8:
        qs.append((x % m1, m1, x % m2, m2))       # compatible
    else:
        qs.append((random.randrange(m1), m1, random.randrange(m2), m2))
tests.append(test(qs))
print(json.dumps(tests))
