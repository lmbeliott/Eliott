import json, random
random.seed(2026)

def test(n, m, k, rects):
    return f"{n} {m} {len(rects)} {k}\n" + "".join(f"{a} {b} {c} {d}\n" for a, b, c, d in rects)

def rect(n, m):
    r1, r2 = sorted((random.randint(1, n), random.randint(1, n)))
    c1, c2 = sorted((random.randint(1, m), random.randint(1, m)))
    return (r1, c1, r2, c2)

def grands(n, m, q, marge):
    # des rectangles qui couvrent presque toute la grille : le pire cas de la solution naïve
    rs = []
    for _ in range(q):
        rs.append((random.randint(1, marge), random.randint(1, marge),
                   random.randint(n - marge + 1, n), random.randint(m - marge + 1, m)))
    return rs

tests = [
    test(4, 5, 2, [(1, 1, 3, 3), (2, 2, 4, 5), (3, 1, 3, 1)]),
    test(3, 3, 1, [(2, 2, 2, 2), (1, 1, 3, 3)]),
]
tests += [
    test(1, 1, 1, [(1, 1, 1, 1)]),
    test(1, 1, 2, [(1, 1, 1, 1)]),                            # personne n'atteint K
    test(5, 5, 3, [(1, 1, 5, 5)] * 3),                        # trois fois la même grille entière
    test(1, 1000, 2, [(1, i, 1, i + 1) for i in range(1, 1000, 2)] + [(1, 1, 1, 1000)]),
    test(1000, 1, 1, [(250, 1, 250, 1)]),
    test(6, 7, 2, [(1, 1, 6, 3), (1, 5, 6, 7), (2, 1, 2, 7), (5, 1, 5, 7)]),
    test(30, 30, 3, [rect(30, 30) for _ in range(40)]),
    test(200, 300, 5, [rect(200, 300) for _ in range(1000)]),
    test(500, 500, 1, [rect(500, 500) for _ in range(3000)]),
    test(1000, 1000, 2500, grands(1000, 1000, 5000, 100)),
    test(1000, 1000, 1000, [rect(1000, 1000) for _ in range(5000)]),
    test(1000, 1000, 5000, [(1, 1, 1000, 1000)] * 4999 + [(1, 1, 1, 1)]),
]
print(json.dumps(tests))
