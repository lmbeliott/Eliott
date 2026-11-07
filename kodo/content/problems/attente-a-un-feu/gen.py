import json, random
random.seed(2026)

def test(v, r, ts):
    return f"{v} {r}\n{len(ts)}\n" + "".join(f"{t}\n" for t in ts)

tests = [test(30, 20, [10, 30, 45, 50, 120]), test(5, 5, [0, 9, 1000000000])]
tests.append(test(1, 1, [0]))
tests.append(test(1, 1000, [1]))
tests.append(test(1000, 1, [999, 1000, 1001]))
tests.append(test(1, 1000, [random.randint(0, 10**9) for _ in range(1000)]))
tests.append(test(7, 3, list(range(1000))))
for _ in range(4):
    v, r = random.randint(1, 1000), random.randint(1, 1000)
    tests.append(test(v, r, [random.randint(0, 10**9) for _ in range(random.randint(1, 1000))]))
print(json.dumps(tests))
