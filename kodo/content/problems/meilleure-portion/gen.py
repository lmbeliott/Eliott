import json, random
random.seed(2026)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

def alea(n, lo=-1000, hi=1000):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [test([3, -5, 4, -1, 2, -6, 5]), test([-4, -2, -7])]
tests.append(test([-1000]))
tests.append(test([0, 0, 0]))
tests.append(test([2, -2, 2]))                    # égalité : la plus tôt, puis la plus courte
tests.append(test([0, 5, -5, 5]))
tests.append(test([1000] * 10))
tests.append(test(alea(50, -5, 5)))
tests.append(test(alea(2000)))
# grands tests : essayer toutes les périodes serait trop lent
tests.append(test(alea(30000)))
tests.append(test(alea(30000, -1000, 990)))
tests.append(test([random.choice([-1, 1, 0]) for _ in range(30000)]))
print(json.dumps(tests))
