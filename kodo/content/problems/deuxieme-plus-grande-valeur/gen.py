import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([12, 5, 30, 18, 7]), make([9, 4, 9]), make([-3, -8])]
tests.append(make([4, 9]))
tests.append(make([9, 4]))
tests.append(make([5, 5, 5, 5]))
tests.append(make([1, 2, 3, 4, 5, 6]))
tests.append(make([6, 5, 4, 3, 2, 1]))
tests.append(make([10**9, -10**9, 10**9]))
tests.append(make([-10**9] * 999 + [-10**9 + 1]))
for n in [10, 1000, 1000]:
    tests.append(make([random.randint(-10**9, 10**9) for _ in range(n)]))
print(json.dumps(tests))
