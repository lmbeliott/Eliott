import json, random
random.seed(2026)

def test(p):
    return f"{len(p)}\n{' '.join(map(str, p))}\n"

def alea(n, lo=1, hi=10**6):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [test([7, 1, 5, 3, 6, 4]), test([9, 7, 4, 1])]
tests.append(test([1, 1000000]))
tests.append(test([1000000, 1]))
tests.append(test([5, 5, 5]))
tests.append(test([3, 8, 1, 4]))                     # le minimum arrive après le maximum
tests.append(test(alea(30, 1, 20)))
tests.append(test(alea(2000)))
# grands tests : essayer tous les couples serait trop lent
tests.append(test(alea(20000)))
tests.append(test(list(range(1000000, 1000000 - 20000 * 37, -37))))   # baisse continue
tests.append(test([random.randint(500000, 10**6) for _ in range(5000)] + [random.randint(1, 500000) for _ in range(5000)]))
print(json.dumps(tests))
