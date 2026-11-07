import json, random
random.seed(2026)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([2, 3, 6, 2]), test([1, 2, 4, 8])]
tests.append(test([7]))
tests.append(test([5, 5]))
tests.append(test([2, 3, 5, 7, 11]))              # aucun
tests.append(test([100000, 1, 50000]))
tests.append(test([random.randint(1, 30) for _ in range(40)]))
tests.append(test([random.randint(1, 100000) for _ in range(1000)]))
# grands tests : tester tous les couples serait trop lent
tests.append(test(list(range(1, 20000)) + [100000]))
tests.append(test([random.randint(1, 100000) for _ in range(20000)]))
tests.append(test([1] * 5000 + [random.randint(1, 100000) for _ in range(15000)]))
tests.append(test([random.choice([6, 12, 30, 60, 60060, 99990]) for _ in range(15000)]))
print(json.dumps(tests))
