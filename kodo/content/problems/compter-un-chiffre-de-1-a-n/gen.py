import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{n} {c}\n" for n, c in qs)

M = 10**18
tests = [test([(13, 1), (100, 0), (100, 9)]), test([(1, 1), (9, 0), (2026, 2)])]
tests.append(test([(1, 0)]))
tests.append(test([(M, c) for c in range(10)]))
tests.append(test([(M - 1, c) for c in range(10)] + [(10**k, 0) for k in range(19)]))
tests.append(test([(random.randint(1, M), random.randint(0, 9)) for _ in range(1000)]))
tests.append(test([(random.randint(1, 10**4), random.randint(0, 9)) for _ in range(1000)]))
tests.append(test([(int(str(random.randint(1, 9)) + str(c) * random.randint(0, 17)), c) for c in range(10) for _ in range(50)]))
tests.append(test([(10**random.randint(0, 18) - random.randint(0, 1) * (1 if random.random() < 0.5 else 0) or 1, random.randint(0, 9)) for _ in range(500)]))
print(json.dumps(tests))
