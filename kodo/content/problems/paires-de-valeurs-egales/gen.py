import json, random
random.seed(2026)


def test(vals):
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"


tests = [test([5, 3, 5, 5, 3]), test([1, 2, 3, 4])]
tests.append(test([7]))
tests.append(test([9, 9]))
tests.append(test([1000] * 30000))
tests.append(test(list(range(1, 1001)) * 3))
tests.append(test([random.randint(1, 1000) for _ in range(30000)]))
tests.append(test([random.randint(1, 3) for _ in range(30000)]))
tests.append(test([random.randint(1, 1000) for _ in range(100)]))
tests.append(test([1, 1000, 1, 1000, 500]))
print(json.dumps(tests))
