import json, random
random.seed(2026)
M = 10**9 + 7

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

tests = [test([1, 2, 3]), test([5, 0, 10, 7])]
tests.append(test([0]))
tests.append(test([10**9]))
tests.append(test([10**9, 10**9]))
tests.append(test([1] * 30))
tests.append(test([0] * 1000))
tests.append(test([random.randint(0, 9) for _ in range(20)]))
tests.append(test([random.randint(0, 10**9) for _ in range(1000)]))
tests.append(test([random.randint(0, 10**9) for _ in range(20000)]))
tests.append(test([random.randint(0, 99) for _ in range(20000)]))
tests.append(test([10**9] * 50 + [10**9 - 1] * 50))
print(json.dumps(tests))
