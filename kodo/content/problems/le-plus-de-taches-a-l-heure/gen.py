import json, random
random.seed(2026)

def test(t):
    return f"{len(t)}\n" + "".join(f"{p} {d}\n" for p, d in t)

tests = [test([(3, 4), (2, 5), (4, 6), (1, 7)]), test([(5, 5), (2, 6), (2, 7), (2, 8)])]
tests.append(test([(10, 5)]))
tests.append(test([(1, 1)]))
tests.append(test([(1000, 10**7)] * 30))
tests.append(test([(3, 3), (3, 3), (3, 3)]))
tests.append(test([(random.randint(1, 10), random.randint(1, 40)) for _ in range(10)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 4 * 10**6)) for _ in range(7000)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 10**6)) for _ in range(10000)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 3 * 10**5)) for _ in range(9000)]))
# longues tâches pressées et courtes tâches tardives
tests.append(test([(random.randint(800, 1000), random.randint(1, 10**5)) if random.random() < 0.5 else (random.randint(1, 50), random.randint(10**5, 2 * 10**5)) for _ in range(9000)]))
print(json.dumps(tests))
