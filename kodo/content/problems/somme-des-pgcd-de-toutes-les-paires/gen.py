import json, random
random.seed(2026)

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

M = 100000
tests = [test([4, 6, 9, 12]), test([5, 5, 5, 7])]
tests.append(test([1]))
tests.append(test([100000, 100000]))
tests.append(test([1] * 100))
tests.append(test([99991, 99989, 99971, 2, 3]))
tests.append(test([random.randint(1, 30) for _ in range(40)]))
tests.append(test([random.randint(1, M) for _ in range(20000)]))
tests.append(test([100000] * 20000))
tests.append(test([random.randint(1, M // 360) * 360 for _ in range(20000)]))
tests.append(test([random.randint(1, 1000) * random.choice([1, 6, 30, 210]) for _ in range(15000)]))
print(json.dumps(tests))
