import json, random
random.seed(2026)

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{n}\n" for n in ns)

tests = [test([7, -1, 2]), test([0, 1, -2, 6])]
tests.append(test([10**18, -10**18]))
tests.append(test([-3, 3, -4, 4, 5, -5]))
tests.append(test(list(range(-20, 21))))
tests.append(test([random.randint(-1000, 1000) for _ in range(200)]))
tests.append(test([sum((-2) ** i for i in range(0, 60, 2)), -sum(2 ** i for i in range(1, 60, 2))]))
# grands tests
tests.append(test([random.randint(-10**18, 10**18) for _ in range(1000)]))
tests.append(test([random.choice([-1, 1]) * (2 ** random.randint(0, 59) + random.randint(-3, 3)) for _ in range(1000)]))
print(json.dumps(tests))
