import json, random
random.seed(2026)


def test(vals):
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"


tests = [test([1, 2, 3, 4]), test([5, -5, 5, -5, 5])]
tests.append(test([42]))
tests.append(test([-7, 3]))
tests.append(test([0, 0, 0]))
tests.append(test([1000] * 1000))
tests.append(test([-1000, 1000, -1000]))
tests.append(test([1] + [0] * 8 + [1]))
for n in [10, 100, 1000, 1000]:
    tests.append(test([random.randint(-1000, 1000) for _ in range(n)]))
print(json.dumps(tests))
