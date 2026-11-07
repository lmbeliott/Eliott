import json, random
random.seed(2026)

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

tests = [test([4, 2, 3, 7, 5]), test([1, 1, 2, 3, 5, 8])]
tests.append(test([7]))
tests.append(test([3, 4, 5]))
tests.append(test([1, 2, 3]))
tests.append(test([10**9] * 3))
tests.append(test([5] * 40))
tests.append(test([2**i for i in range(30)]))
tests.append(test([random.randint(1, 20) for _ in range(60)]))
tests.append(test([random.randint(1, 10**9) for _ in range(1500)]))
tests.append(test([random.randint(1, 1000) for _ in range(1500)]))
tests.append(test([random.randint(10**9 // 2, 10**9) for _ in range(1500)]))
tests.append(test([random.choice([1, 10**9]) for _ in range(1500)]))
print(json.dumps(tests))
