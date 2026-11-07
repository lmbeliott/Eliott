import json, random
random.seed(2026)


def test(vals, ops):
    s = f"{len(vals)} {len(ops)}\n" + " ".join(map(str, vals)) + "\n"
    return s + "".join(f"{l} {r}\n" for l, r in ops)


def ops_aleatoires(n, m):
    res = []
    for _ in range(m):
        l = random.randint(1, n)
        res.append((l, random.randint(l, n)))
    return res


tests = [test([1, 2, 3, 4, 5], [(2, 4)]), test([10, 20, 30, 40, 50, 60], [(1, 6), (1, 3), (5, 5)])]
tests.append(test([7], [(1, 1)]))
tests.append(test([1, 2], [(1, 2)]))
tests.append(test([1, 2, 3, 4], [(1, 4), (1, 4)]))         # deux fois : retour au départ
tests.append(test([3, 1, 4, 1, 5, 9, 2, 6], [(2, 7), (3, 3), (1, 2), (4, 8)]))
n = 1000
tests.append(test(list(range(1, n + 1)), [(1, n)] * 999))
tests.append(test(list(range(1, n + 1)), [(1, n - i) for i in range(1000)]))
for n, m in [(10, 5), (100, 100), (1000, 1000)]:
    tests.append(test([random.randint(-10**9, 10**9) for _ in range(n)], ops_aleatoires(n, m)))
print(json.dumps(tests))
