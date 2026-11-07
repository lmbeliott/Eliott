import json, random
random.seed(2026)

def test(p):
    return f"{len(p)}\n{' '.join(map(str, p))}\n"

tests = [test([1, 3, 9]), test([2, 2])]
tests.append(test([1]))
tests.append(test([1000000]))
tests.append(test([3 ** i for i in range(10)]))
tests.append(test([1] * 10))
tests.append(test([1, 2, 4, 8, 16, 32, 64, 128, 256, 512]))
tests.append(test([10 ** 6] * 10))
tests.append(test([random.randint(1, 20) for _ in range(10)]))
tests.append(test([random.randint(1, 1000) for _ in range(10)]))
tests.append(test([random.randint(1, 10 ** 6) for _ in range(10)]))
tests.append(test([1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19684]))
tests.append(test([random.randint(1, 5) for _ in range(7)]))
print(json.dumps(tests))
