import json, random
random.seed(2026)

def make(r, p):
    return " ".join(map(str, r)) + "\n" + " ".join(map(str, p)) + "\n"

R = (0, 0, 10, 5)
tests = [make(R, (3, 2)), make(R, (10, 4)), make(R, (12, 2))]
tests.append(make(R, (0, 0)))
tests.append(make(R, (10, 5)))
tests.append(make(R, (0, 7)))
tests.append(make(R, (-1, 3)))
tests.append(make(R, (5, -1)))
tests.append(make(R, (5, 5)))
tests.append(make((-1000, -1000, 1000, 1000), (-1000, 999)))
tests.append(make((-1000, -1000, 1000, 1000), (999, -999)))
tests.append(make((-5, -8, -4, -2), (-4, -9)))
for _ in range(3):
    x1, x2 = sorted(random.sample(range(-1000, 1001), 2))
    y1, y2 = sorted(random.sample(range(-1000, 1001), 2))
    tests.append(make((x1, y1, x2, y2), (random.randint(-1000, 1000), random.randint(-1000, 1000))))
print(json.dumps(tests))
