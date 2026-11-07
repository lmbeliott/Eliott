import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([5, 2, 2, 8, -1]), make([-3, -1, -4])]
tests.append(make([0]))
tests.append(make([0, 0, 0]))
tests.append(make([100]))
tests.append(make([-100, 100] * 500))
tests.append(make([3, 3, 1, 1, 4]))
tests.append(make(list(range(1, 101))))
tests.append(make([random.randint(-100, 100) for _ in range(15)]))
tests.append(make([random.randint(-100, 100) for _ in range(1000)]))
vals, cur = [], 0
for _ in range(1000):
    cur = min(100, max(-100, cur + random.choice([-3, -1, 0, 0, 1, 2, 5])))
    vals.append(cur)
tests.append(make(vals))
print(json.dumps(tests))
