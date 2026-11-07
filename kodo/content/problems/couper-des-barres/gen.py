import json, random
random.seed(2026)

def test(k, ls):
    return f"{len(ls)} {k}\n{' '.join(map(str, ls))}\n"

tests = [test(2, [7, 5]), test(4, [10, 3, 6, 8])]
tests.append(test(0, [5, 9, 2]))                     # aucune coupe
tests.append(test(10**9, [1]))                       # morceaux de longueur 1
tests.append(test(10**9, [10**9] * 3))
tests.append(test(5, [1, 1, 1, 1]))
tests.append(test(1, [10**9]))
tests.append(test(random.randint(0, 200), [random.randint(1, 100) for _ in range(50)]))
tests.append(test(random.randint(0, 10**9), [random.randint(1, 10**9) for _ in range(10000)]))
tests.append(test(123456, [random.randint(1, 10**9) for _ in range(10000)]))
tests.append(test(9999, [random.randint(10**8, 10**9) for _ in range(10000)]))
tests.append(test(10**9, [random.randint(1, 10**9) for _ in range(5000)]))
print(json.dumps(tests))
