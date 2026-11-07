import json, random
random.seed(2026)

def test(c):
    return f"{len(c)}\n" + "".join(f"{w} {s}\n" for w, s in c)

tests = [test([(10, 3), (2, 5), (3, 3)]), test([(5, 1), (1, 9), (4, 4), (2, 6)])]
tests.append(test([(7, 100)]))
tests.append(test([(3, 3)] * 5))
tests.append(test([(1, 1000000), (10000, 1), (5000, 5000)]))
tests.append(test([(random.randint(1, 10), random.randint(1, 10)) for _ in range(8)]))
tests.append(test([(random.randint(1, 100), random.randint(1, 1000)) for _ in range(40)]))
tests.append(test([(random.randint(1, 10000), random.randint(1, 10**6)) for _ in range(10000)]))
tests.append(test([(random.randint(1, 10000), random.randint(1, 10**4)) for _ in range(10000)]))
# lourdes et peu résistantes contre légères et très résistantes
tests.append(test([(random.randint(9000, 10000), random.randint(1, 100)) if random.random() < 0.5 else (random.randint(1, 100), random.randint(10**5, 10**6)) for _ in range(8000)]))
print(json.dumps(tests))
