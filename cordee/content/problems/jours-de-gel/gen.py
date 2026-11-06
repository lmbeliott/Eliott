import json, random
random.seed(2026)

def test(temps):
    return f"{len(temps)}\n" + "".join(f"{t}\n" for t in temps)

tests = [test([3, -2, 0, -7, 4]), test([1, 2, 3])]
tests.append(test([-1]))
tests.append(test([0]))
tests.append(test([0, 0, 0, 0, 0, 0]))
tests.append(test([-30] * 31))
tests.append(test([30, -30, 0, -1, 1, 0, -15]))
tests.append(test([random.randint(-30, 30) for _ in range(1000)]))
tests.append(test([random.randint(-3, 3) for _ in range(1000)]))
for _ in range(3):
    n = random.randint(5, 31)
    tests.append(test([random.randint(-10, 10) for _ in range(n)]))
print(json.dumps(tests))
