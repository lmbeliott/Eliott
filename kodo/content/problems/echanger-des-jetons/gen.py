import json, random
random.seed(2026)

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{x}\n" for x in ns)

tests = [test([30, 12, 100]), test([0, 1, 1000000])]
tests.append(test([10**18]))
tests.append(test([0]))
tests.append(test(list(range(0, 50))))
tests.append(test([10**18 - i for i in range(50)]))
tests.append(test([random.randint(0, 10**18) for _ in range(50)]))
tests.append(test([random.randint(0, 10**9) for _ in range(50)]))
tests.append(test([2**59, 3**37, 5**25, 2**30 * 3**18, 999999999999999999, 720720720720720720]))
tests.append(test([random.randint(10**17, 10**18) for _ in range(50)]))
print(json.dumps(tests))
