import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"

tests = [make([3, 8, 5, 0, 12]), make([7])]
tests.append(make([0]))
tests.append(make([2, 4, 6, 8]))
tests.append(make([1, 3, 5, 7, 9, 11]))
tests.append(make([10**9] * 1000))
tests.append(make([10**9 - 1] * 1000))
for n in [10, 100, 1000, 1000]:
    tests.append(make([random.randint(0, 10**9) for _ in range(n)]))
print(json.dumps(tests))
