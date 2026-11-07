import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{l} {r}\n" for l, r in qs)

def alea(q, n):
    res = []
    for _ in range(q):
        l = random.randint(1, n)
        r = random.randint(l, n)
        res.append((l, r))
    return res

tests = [test([(1, 20), (12, 12), (13, 17)]), test([(1, 100), (10, 10), (940, 950)])]
tests.append(test([(1, 1)]))
tests.append(test([(1, 100000), (100000, 100000), (99999, 99999), (1, 11), (945, 945)]))
tests.append(test(alea(100, 1000)))
tests.append(test(alea(10000, 100000)))
tests.append(test([(random.randint(1, 1000), random.randint(99000, 100000)) for _ in range(10000)]))
tests.append(test(alea(5000, 100000)))
tests.append(test([(x, x) for x in random.sample(range(1, 100001), 3000)]))
print(json.dumps(tests))
