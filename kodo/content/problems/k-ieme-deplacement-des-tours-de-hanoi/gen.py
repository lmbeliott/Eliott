import json, random
random.seed(2026)

def test(n, ks):
    return f"{n} {len(ks)}\n" + "".join(f"{k}\n" for k in ks)

tests = [test(3, [1, 2, 3, 4, 5, 6, 7]), test(10, [1, 512, 1023, 700])]
tests.append(test(1, [1]))
tests.append(test(2, [1, 2, 3]))
tests.append(test(60, [1, 2**59, 2**60 - 1, 2**59 - 1, 2**59 + 1, 2**58, 3 * 2**58]))
tests.append(test(8, list(range(1, 256))))
tests.append(test(32, [random.randint(1, 2**32 - 1) for _ in range(1000)]))
tests.append(test(33, [2**31, 2**32, 2**32 + 1] + [random.randint(1, 2**33 - 1) for _ in range(997)]))
tests.append(test(60, [random.randint(1, 2**60 - 1) for _ in range(1000)]))
tests.append(test(59, [random.choice([2**random.randint(0, 58), random.randint(1, 2**59 - 1)]) for _ in range(1000)]))
tests.append(test(45, [random.randint(1, 2**45 - 1) for _ in range(500)]))
print(json.dumps(tests))
