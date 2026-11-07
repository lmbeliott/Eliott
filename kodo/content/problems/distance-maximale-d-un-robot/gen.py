import json, random
random.seed(2026)

def test(orders):
    return f"{len(orders)}\n" + "".join(f"{d} {k}\n" for d, k in orders)

tests = [test([("N", 3), ("E", 4), ("S", 10), ("O", 2)]), test([("O", 5), ("E", 5)])]
tests.append(test([("S", 1)]))
tests.append(test([("N", 1000000)] * 1000))
tests.append(test([("E", 7), ("O", 14), ("E", 7)]))
tests.append(test([("N", 2), ("S", 2)] * 500))
tests.append(test([("E", 1000000), ("N", 1000000), ("O", 2000000), ("S", 2000000)]))
for n in [10, 100, 1000, 1000]:
    tests.append(test([(random.choice("NSEO"), random.randint(1, 10**6)) for _ in range(n)]))
print(json.dumps(tests))
