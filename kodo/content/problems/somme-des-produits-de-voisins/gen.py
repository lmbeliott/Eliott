import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([2, 3, -1, 4]), make([5, 7])]
tests.append(make([0, 1000]))
tests.append(make([1000] * 1000))
tests.append(make([1000, -1000] * 500))
tests.append(make([-1000] * 1000))
tests.append(make([1, 0, 1, 0, 1]))
for n in [3, 20, 500, 1000]:
    tests.append(make([random.randint(-1000, 1000) for _ in range(n)]))
print(json.dumps(tests))
