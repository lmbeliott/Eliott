import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([410, 395, 432, 432, 450, 448]), make([500])]
tests.append(make([7, 7, 7, 7]))
tests.append(make(list(range(1, 1001))))
tests.append(make(list(range(1000, 0, -1))))
tests.append(make([1, 1000000, 999999, 1000000]))
tests.append(make([3, 1, 4, 1, 5, 9, 2, 6]))
for n in [20, 1000]:
    tests.append(make([random.randint(1, 10**6) for _ in range(n)]))
vals, cur = [], 1000
for _ in range(1000):
    cur += random.randint(-30, 40)
    vals.append(max(1, cur))
tests.append(make(vals))
print(json.dumps(tests))
