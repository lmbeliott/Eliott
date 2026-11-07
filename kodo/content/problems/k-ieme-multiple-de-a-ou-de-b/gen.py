import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{a} {b} {k}\n" for a, b, k in qs)

tests = [test([(4, 6, 1), (4, 6, 5), (4, 6, 8), (3, 5, 10), (7, 7, 3)])]
G = 10**9
tests.append(test([(1, 1, 1), (1, G, G), (G, G, G), (G, G - 1, G), (G, 1, 1), (2, 4, G), (G - 1, G, 1),
                   (999999937, 999999929, G), (6, 10, 7), (12, 18, 1000)]))
tests.append(test([(a, b, k) for a in range(1, 6) for b in range(1, 6) for k in (1, 2, 3, 7)]))
for _ in range(3):
    qs = []
    for _ in range(1000):
        mode = random.random()
        if mode < 0.3:
            a, b = random.randint(1, G), random.randint(1, G)
        elif mode < 0.6:
            g = random.randint(1, 10**5)
            a, b = g * random.randint(1, G // g), g * random.randint(1, G // g)
        else:
            a = random.randint(1, 10**5)
            b = a * random.randint(1, G // a)
        qs.append((a, b, random.randint(1, G)))
    tests.append(test(qs))
tests.append(test([(random.randint(G - 1000, G), random.randint(G - 1000, G), G) for _ in range(1000)]))
print(json.dumps(tests))
