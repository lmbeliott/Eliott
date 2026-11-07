import json, random
random.seed(3106)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([4, 1, 3]), test([10, 2, 2, 7, 5])]
tests.append(test([42]))                                  # aucune paire
tests.append(test([7, 7, 7, 7]))                          # tous les écarts sont nuls
tests.append(test([0, 1000000]))
tests.append(test(list(range(100, 0, -1))))
tests.append(test([random.randint(0, 1000) for _ in range(500)]))
tests.append(test([random.randint(0, 10**6) for _ in range(3000)]))
# grands tests : examiner les paires une par une serait trop lent
tests.append(test([random.randint(0, 10**6) for _ in range(20000)]))
tests.append(test([random.choice([0, 10**6]) for _ in range(20000)]))
print(json.dumps(tests))
