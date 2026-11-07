import json, random
random.seed(2026)

def test(c, p):
    return f"{len(p)} {c}\n{' '.join(map(str, p))}\n"

tests = [test(100, [5, 95, 40, 70]), test(12, [0, 3, 6, 9]), test(10, [7, 2, 7, 7, 4])]
tests.append(test(100, [5, 95]))
tests.append(test(10, [0, 5]))
tests.append(test(1, [0, 0]))
tests.append(test(1000000000, [0, 999999999]))
tests.append(test(1000000000, [0, 500000000, 999999999]))
tests.append(test(30, [0, 10, 20]))
tests.append(test(1000, [random.randint(0, 999) for _ in range(30)]))
tests.append(test(10**9, [random.randint(0, 10**9 - 1) for _ in range(15000)]))
tests.append(test(10**9, sorted(random.sample(range(0, 10**9, 66666), 8000))))
tests.append(test(10**6, [random.randint(0, 10**6 - 1) for _ in range(12000)]))
tests.append(test(6000 * 7, [7 * i for i in range(6000)][::-1]))
tests.append(test(10**9, random.sample(range(10**9), 2000)))
print(json.dumps(tests))
