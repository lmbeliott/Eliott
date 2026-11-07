import json, random
random.seed(2026)

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{n}\n" for n in ns)

L = 10**17
tests = [test([1, 2, 3, 4, 5, 8, 10, 1000])]
tests.append(test(list(range(1, 101))))
tests.append(test([L, L - 1, 2 ** 56, 2 ** 56 + 1, 2 ** 56 - 1, 3 * 2 ** 54, 99999999999999999]))
tests.append(test([2 ** k + d for k in range(1, 57) for d in (-1, 0, 1)]))
tests.append(test([random.randint(1, L) for _ in range(1000)]))
tests.append(test([random.randint(1, 10**6) for _ in range(1000)]))
tests.append(test([L - random.randint(0, 10**9) for _ in range(1000)]))
print(json.dumps(tests))
