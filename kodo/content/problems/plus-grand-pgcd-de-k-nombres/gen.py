import json, random
random.seed(2026)

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

M = 100000
tests = [test([6, 10, 15, 12, 9]), test([7, 7, 14, 1, 21, 28])]
tests.append(test([1]))
tests.append(test([100000]))
tests.append(test([99991, 99989]))
tests.append(test([100000] * 20))
tests.append(test([random.randint(1, 100) for _ in range(50)]))
tests.append(test([random.randint(1, M) for _ in range(20000)]))
tests.append(test([random.randint(1, M // 720) * 720 for _ in range(10000)] + [random.randint(1, M) for _ in range(10000)]))
tests.append(test(random.sample(range(1, M + 1), 12000)))
tests.append(test([random.choice([2, 3, 5, 7]) * random.randint(1, 1000) for _ in range(10000)]))
print(json.dumps(tests))
