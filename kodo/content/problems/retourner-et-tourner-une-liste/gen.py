import json, random
random.seed(2026)


def test(n, ops, vals=None):
    if vals is None:
        vals = list(range(1, n + 1))
    s = f"{n} {len(ops)}\n" + " ".join(map(str, vals)) + "\n"
    return s + "".join(op + "\n" for op in ops)


def ops_aleatoires(n, q, p_tourner=0.5):
    ops = []
    for _ in range(q):
        if random.random() < p_tourner:
            ops.append(f"T {random.randint(0, n - 1)}")
        else:
            l = random.randint(1, n)
            d = random.randint(l, n)
            ops.append(f"R {l} {d}")
    return ops


tests = [test(5, ["R 2 4", "T 2"]), test(6, ["T 1", "T 1", "R 1 6", "T 0"], [7, 3, 9, 3, 1, 8])]
tests.append(test(1, ["T 0", "R 1 1"], [42]))
tests.append(test(2, ["T 1", "R 1 2", "T 1"]))
tests.append(test(10, ["T 9"]))
tests.append(test(10, ["R 1 10", "R 1 10", "R 3 3"]))
tests.append(test(1000, ["T 999"] * 300))
tests.append(test(1000, ["R 1 1000"] * 299 + ["T 500"]))
for n, q in [(8, 10), (50, 40), (1000, 300), (1000, 300), (999, 300)]:
    vals = [random.randint(1, 10**9) for _ in range(n)]
    tests.append(test(n, ops_aleatoires(n, q), vals))
print(json.dumps(tests))
