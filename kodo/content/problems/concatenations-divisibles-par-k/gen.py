import json, random
random.seed(2026)

def test(k, x):
    return f"{len(x)} {k}\n{' '.join(map(str, x))}\n"

tests = [test(3, [1, 2, 3]), test(4, [12, 5, 3])]
tests.append(test(1, [7]))
tests.append(test(7, [7]))
tests.append(test(1, [random.randint(1, 10**9) for _ in range(8)]))
tests.append(test(10**9, [10**9] * 8))
tests.append(test(11, [1, 1, 1, 1, 1, 1, 1, 1]))
tests.append(test(9, [123, 456, 789, 12, 34, 56, 78, 9]))
tests.append(test(8, [random.randint(1, 99) for _ in range(8)]))
tests.append(test(37, [random.randint(1, 1000) for _ in range(8)]))
tests.append(test(999999937, [random.randint(1, 10**9) for _ in range(8)]))
tests.append(test(13, [random.randint(1, 10**9) for _ in range(8)]))
tests.append(test(1000, [10, 20, 500, 3, 40, 7, 100, 60]))
tests.append(test(random.randint(2, 50), [random.randint(1, 10**4) for _ in range(6)]))
print(json.dumps(tests))
