import json, random
random.seed(2026)

def test(pts):
    return f"{len(pts)}\n" + "".join(f"{x} {y}\n" for x, y in pts)

def alea(n, m):
    return [(random.randint(0, m), random.randint(0, m)) for _ in range(n)]

tests = [test([(0, 0), (2, 1), (1, 3)]), test([(5, 5), (5, 5), (0, 10), (10, 0)])]
tests.append(test([(7, 7)]))
tests.append(test([(0, 0), (10000, 10000)]))
tests.append(test([(3, 4)] * 50))
tests.append(test(alea(100, 10)))
tests.append(test(alea(2000, 10000)))
tests.append(test(alea(15000, 10000)))
tests.append(test([random.choice([(0, 0), (10000, 10000), (0, 10000), (10000, 0)]) for _ in range(15000)]))
tests.append(test([(i % 101, i // 101) for i in range(5000)]))
print(json.dumps(tests))
