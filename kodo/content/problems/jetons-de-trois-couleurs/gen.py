import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{r} {v} {b}\n" for r, v, b in qs)

H = 10**9
tests = [test([(1, 4, 0), (2, 1, 0), (3, 0, 0)]), test([(1, 1, 1), (4, 7, 1), (0, 5, 2)])]
tests.append(test([(1, 0, 0), (0, 0, 1), (0, 1, 1), (2, 0, 0)]))
tests.append(test([(H, H, H), (H, 0, 0), (H, H - 1, H - 2), (H - 3, H, 1)]))
tests.append(test([(r, v, b) for r in range(6) for v in range(6) for b in range(6) if r + v + b > 0]))
tests.append(test([(random.randint(0, 50), random.randint(0, 50), random.randint(0, 50)) for _ in range(300)]))
# grands tests
tests.append(test([(random.randint(0, H), random.randint(0, H), random.randint(0, H)) for _ in range(5000)]))
qs = []
for _ in range(5000):
    x = random.randint(0, H - 3)
    y = x + 3 * random.randint(0, (H - x) // 3)
    trio = [x, y, random.randint(0, H)]
    random.shuffle(trio)
    qs.append(tuple(trio))
tests.append(test(qs))
print(json.dumps(tests))
