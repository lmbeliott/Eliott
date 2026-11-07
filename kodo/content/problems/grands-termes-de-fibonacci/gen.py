import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{n} {m}\n" for n, m in qs)

L = 10**18
G = 10**9
tests = [test([(0, 10), (1, 10), (10, 1000), (20, 1000), (90, 1000000000), (10**18, 999999937)])]
tests.append(test([(n, 1000000000) for n in range(0, 91)]))
tests.append(test([(L, 1), (L, G), (L - 1, G), (L, 2), (L, 3), (0, 1), (1, 1), (2, G), (L, 999999937)]))
tests.append(test([(random.randint(0, L), random.randint(1, G)) for _ in range(1000)]))
tests.append(test([(random.randint(0, L), random.randint(1, 100)) for _ in range(1000)]))
tests.append(test([(L - random.randint(0, 10**6), G - random.randint(0, 10**3)) for _ in range(1000)]))
tests.append(test([(2 ** k + d, random.randint(1, G)) for k in range(59) for d in (-1, 0, 1) if 2 ** k + d >= 0]))
tests.append(test([(random.randint(0, L), random.choice([1, 2, 3, 5, 10, 1000000007 % G])) for _ in range(500)]))
print(json.dumps(tests))
