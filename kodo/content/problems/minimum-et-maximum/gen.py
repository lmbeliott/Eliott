import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([4, -2, 9, 0, 3]), make([7])]
tests.append(make([-5, -2, -9, -3]))
tests.append(make([3, 8, 12, 5]))
tests.append(make([6, 6, 6]))
tests.append(make([10**9, -10**9]))
tests.append(make([-10**9] * 1000))
tests.append(make(list(range(1, 1001))))
tests.append(make(list(range(1000, 0, -1))))
for n in [10, 1000, 1000]:
    tests.append(make([random.randint(-10**9, 10**9) for _ in range(n)]))
print(json.dumps(tests))
