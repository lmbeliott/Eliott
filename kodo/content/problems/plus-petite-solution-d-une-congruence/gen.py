import json, random
from math import gcd
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b} {m}\n" for a, b, m in qs)

G = 10**9
tests = [test([(4, 2, 6), (4, 3, 6), (3, 1, 7), (0, 0, 5), (0, 3, 5), (0, 0, 1)])]
tests.append(test([(a, b, m) for m in range(1, 9) for a in range(m) for b in range(m)][:1000]))
qs = [(G - 1, 1, G), (2, 1, G), (2, 0, G), (G // 2, G // 2, G), (999999937 - 1, 5, 999999937), (123456789, 987654321 % G, G),
      (0, 0, G), (1, G - 1, G), (500000000, 0, G), (999999999, 999999998, 999999999 + 1)]
tests.append(test(qs))
qs = []
for _ in range(1000):
    m = random.randint(1, G); a = random.randrange(m); b = random.randrange(m)
    qs.append((a, b, m))
tests.append(test(qs))
qs = []
for _ in range(1000):
    g = random.choice([1, 2, 3, 6, 1000, 2 ** 20, random.randint(1, 1000)])
    m = g * random.randint(1, G // g)
    a = g * random.randrange(m // g)
    b = (a * random.randrange(m) % m) if random.random() < 0.8 else random.randrange(m)
    qs.append((a, b, m))
tests.append(test(qs))
qs = []
for _ in range(1000):
    m = random.choice([999999937, 999999929, 1000000000, 536870912])
    qs.append((random.randrange(m), random.randrange(m), m))
tests.append(test(qs))
print(json.dumps(tests))
