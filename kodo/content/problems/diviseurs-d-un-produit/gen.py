import json, random
random.seed(2026)

V = 10**6

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([4, 6, 5]), test([12, 18, 1, 7, 49])]
tests.append(test([1]))
tests.append(test([1] * 10))
tests.append(test([999983]))
tests.append(test([2] * 10000))                        # 2^10000
tests.append(test([999983] * 5000 + [999979] * 5000))
tests.append(test([random.randint(1, V) for _ in range(10000)]))
tests.append(test([random.randint(1, 1000) for _ in range(10000)]))
tests.append(test([random.choice([2, 3, 4, 6, 8, 9, 12, 16, 720720, 524288]) for _ in range(10000)]))
tests.append(test([random.randint(1, V) for _ in range(30)]))
print(json.dumps(tests))
