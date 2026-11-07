import json, random
random.seed(2026)

def make(s, ops):
    return f"{s} {len(ops)}\n" + "".join(f"{x}\n" for x in ops)

tests = [make(100, [50, -30, 20]), make(10, [-25, 5])]
tests.append(make(0, [0]))
tests.append(make(1000000, [10000] * 1000))
tests.append(make(0, [-10000] * 1000))
tests.append(make(500, [-500]))
tests.append(make(42, [7]))
for n in [10, 100, 1000, 1000]:
    tests.append(make(random.randint(0, 10**6), [random.randint(-10000, 10000) for _ in range(n)]))
print(json.dumps(tests))
