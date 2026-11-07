import json, random
random.seed(2026)


def test(vals):
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"


G = 10**9
tests = [test([3, 8, 1, 6, 4]), test([-5, -2, -9])]
tests.append(test([7]))
tests.append(test([4, 4, 4, 4]))
tests.append(test([-G, G]))
tests.append(test([G, -G, 0]))
tests.append(test([-G] * 5))
tests.append(test([random.randint(-100, 100) for _ in range(20)]))
tests.append(test([random.randint(-G, G) for _ in range(10000)]))
tests.append(test([random.randint(-G, -1) for _ in range(10000)]))
tests.append(test(list(range(1, 5001))))
print(json.dumps(tests))
