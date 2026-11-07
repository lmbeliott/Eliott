import json, random
random.seed(2026)

def test(k, t):
    return f"{len(t)} {k}\n{' '.join(map(str, t))}\n"

def alea(n, hi=10**6):
    return [random.randint(0, hi) for _ in range(n)]

tests = [test(5, [1, 4, 6, 9, 5]), test(2, [3, 3, 3, 8])]
tests.append(test(1, [7]))
tests.append(test(1, [0, 5, 9, 2]))                # toutes les paires
tests.append(test(10**6, [0, 10**6, 500000, 500000, 1]))
tests.append(test(4, [2, 6, 10, 1]))               # reste K / 2
tests.append(test(7, [1, 2, 3]))                   # aucune
tests.append(test(3, alea(40, 20)))
tests.append(test(1000, alea(2000)))
# grands tests : essayer toutes les paires serait trop lent
tests.append(test(6, alea(20000)))
tests.append(test(999983, alea(20000)))
tests.append(test(2, [random.choice([2, 4, 1000000]) for _ in range(20000)]))
print(json.dumps(tests))
