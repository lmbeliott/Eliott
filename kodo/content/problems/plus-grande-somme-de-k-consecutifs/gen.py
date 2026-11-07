import json, random
random.seed(2026)


def test(vals, k):
    return f"{len(vals)} {k}\n" + " ".join(map(str, vals)) + "\n"


tests = [test([2, -1, 4, 3, -5, 6], 2), test([1, 2, 3, 1, 2, 3], 3)]
tests.append(test([-7], 1))
tests.append(test([5, 5, 5, 5], 4))
tests.append(test([-3, -1, -2, -1], 1))
tests.append(test([-1000] * 10, 3))
tests.append(test([0, 0, 0, 1], 2))
tests.append(test([random.randint(-1000, 1000) for _ in range(30000)], 15000))
tests.append(test([random.randint(-1, 1) for _ in range(30000)], 1000))
tests.append(test([random.randint(-1000, 1000) for _ in range(5000)], 1))
tests.append(test([random.randint(-1000, 1000) for _ in range(200)], 37))
print(json.dumps(tests))
