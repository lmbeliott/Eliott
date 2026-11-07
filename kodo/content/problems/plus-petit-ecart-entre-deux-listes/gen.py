import json, random
random.seed(2026)

def test(a, b):
    return f"{len(a)}\n{' '.join(map(str, a))}\n{len(b)}\n{' '.join(map(str, b))}\n"

def alea(n, lo, hi):
    return sorted(random.randint(lo, hi) for _ in range(n))

tests = [test([1, 7, 15, 30], [10, 22, 40]), test([5, 9], [9, 100])]
tests.append(test([0], [1000000]))
tests.append(test([42], [42]))
tests.append(test([1, 2, 3], [100, 200, 300]))
tests.append(test([100, 200, 300], [1, 2, 302]))
tests.append(test(alea(20, 0, 1000), alea(30, 0, 1000)))
tests.append(test(alea(300, 0, 10**6), alea(5, 0, 10**6)))
# grands tests : essayer tous les couples serait trop lent
tests.append(test(list(range(0, 1000000, 100))[:10000], list(range(37, 1000000, 100))[:10000]))
tests.append(test(alea(10000, 0, 10**6), alea(10000, 0, 10**6)))
tests.append(test(alea(6000, 0, 400000), alea(6000, 600000, 10**6)))
print(json.dumps(tests))
