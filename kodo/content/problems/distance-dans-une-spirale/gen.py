import json, random
random.seed(2026)

G = 10**9

def test(paires):
    return f"{len(paires)}\n" + "".join(f"{a} {b}\n" for a, b in paires)

tests = [
    test([(1, 9), (4, 15), (12, 21)]),
    test([(1, 1000000000), (7, 7)]),
]
tests += [
    test([(1, 1)]),
    test([(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7), (7, 8), (8, 9), (9, 10), (10, 11)]),
    test([(9, 25), (25, 49), (49, 81), (1, 81), (81, 82)]),           # coins en bas à droite
    test([(3, 13), (5, 17), (7, 21), (13, 21), (17, 25), (31, 43)]),   # autres coins
    test([(31619 * 31619, 31621 * 31621), (999950884, 999950885)]),
    test([(G, G - 1), (G, 1), (G, 2), (G, 999999000), (G, 999937024)]),
    test([(random.randint(1, 100), random.randint(1, 100)) for _ in range(10)]),
    test([(random.randint(1, 10**6), random.randint(1, 10**6)) for _ in range(10)]),
    test([(random.randint(1, G), random.randint(1, G)) for _ in range(10)]),
    test([(random.randint(G - 10**5, G), random.randint(G - 10**5, G)) for _ in range(10)]),
    test([(random.randint(1, G), random.randint(1, 50)) for _ in range(10)]),
]
print(json.dumps(tests))
