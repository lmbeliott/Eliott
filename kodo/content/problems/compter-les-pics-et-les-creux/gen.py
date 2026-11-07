import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([3, 7, 4, 4, 9, 2, 5]), make([2, 5, 5, 3])]
tests.append(make([1, 2, 3]))
tests.append(make([1, 5, 1]))
tests.append(make([5, 1, 5]))
tests.append(make([0, 0, 0, 0]))
tests.append(make([0, 10000] * 500))
tests.append(make(list(range(1000))))
tests.append(make([3, 1, 3, 1, 3, 3, 1]))
tests.append(make([random.randint(0, 10) for _ in range(20)]))
tests.append(make([random.randint(0, 10000) for _ in range(1000)]))
vals, cur = [], 5000
for _ in range(1000):
    cur = min(10000, max(0, cur + random.choice([-2, -1, 0, 1, 2])))
    vals.append(cur)
tests.append(make(vals))
print(json.dumps(tests))
