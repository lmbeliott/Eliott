import json, random
random.seed(3105)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([2, 9, 4]), test([10, 1, 7, 3])]
tests.append(test([500]))                                # une seule maison
tests.append(test([0, 1000000]))                         # deux maisons : le plus petit point optimal
tests.append(test([5, 5, 5, 5, 5]))
tests.append(test([0, 0, 0, 1000000, 1000000]))
tests.append(test([random.randint(0, 100) for _ in range(30)]))
tests.append(test([random.randint(0, 10**6) for _ in range(1000)]))
tests.append(test([random.choice([0, 10**6]) for _ in range(4000)]))
# grands tests : essayer chaque maison comme point de rendez-vous serait trop lent
tests.append(test([random.randint(0, 10**6) for _ in range(20000)]))
tests.append(test([random.randint(0, 10**6) for _ in range(19999)]))
print(json.dumps(tests))
