import json, random
random.seed(2026)

def make(a, b, vals):
    return f"{len(vals)} {a} {b}\n" + " ".join(map(str, vals)) + "\n"

tests = [make(15, 25, [12, 18, 20, 26, 17, 15, 25, 30]), make(0, 10, [-5, 11, 20]), make(-3, -3, [-3, -3, 0, -3])]
tests.append(make(-50, 50, [7]))
tests.append(make(5, 5, [4]))
tests.append(make(-50, 50, [random.randint(-50, 50) for _ in range(10000)]))
tests.append(make(0, 0, [0] * 10000))
tests.append(make(10, 20, [9, 21] * 5000))
tests.append(make(10, 20, [5] * 9999 + [15]))
tests.append(make(10, 20, [15] * 5000 + [25] + [15] * 4999))
for _ in range(3):
    a = random.randint(-50, 50)
    b = random.randint(a, 50)
    tests.append(make(a, b, [random.randint(-50, 50) for _ in range(random.randint(50, 10000))]))
print(json.dumps(tests))
