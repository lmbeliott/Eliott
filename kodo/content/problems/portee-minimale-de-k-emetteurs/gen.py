import json, random
random.seed(2026)

def test(k, xs):
    return f"{len(xs)} {k}\n{' '.join(map(str, xs))}\n"

tests = [test(2, [1, 4, 12, 9, 2]), test(3, [10, 0, 21, 7, 30, 14])]
tests.append(test(1, [5]))
tests.append(test(1, [0, 10**9]))
tests.append(test(2, [0, 10**9]))
tests.append(test(3, [8, 8, 8, 8]))
tests.append(test(1, [3, 4]))
tests.append(test(4, [random.randint(0, 100) for _ in range(30)]))
tests.append(test(10000, [random.randint(0, 10**9) for _ in range(10000)]))
tests.append(test(37, [random.randint(0, 10**9) for _ in range(10000)]))
# maisons regroupées en paquets
xs = []
for _ in range(500):
    c = random.randint(0, 10**9 - 10**5)
    xs += [c + random.randint(0, 10**5) for _ in range(20)]
random.shuffle(xs)
tests.append(test(500, xs))
tests.append(test(1234, [random.randint(0, 10**9) for _ in range(9000)]))
print(json.dumps(tests))
