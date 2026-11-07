import json, random
random.seed(2026)

def test(k, t):
    return f"{len(t)} {k}\n{' '.join(map(str, t))}\n"

def alea(n):
    return [random.randint(0, 999) for _ in range(n)]

tests = [test(2, [1, 2, 3, 4, 5]), test(-1, [10, 20, 30, 40])]
tests.append(test(10**18, [7]))
tests.append(test(0, [3, 1, 2]))
tests.append(test(6, [1, 2, 3, 4, 5, 6]))          # un tour complet
tests.append(test(-7, [1, 2, 3, 4, 5, 6]))
tests.append(test(13, [5, 5, 0, 5]))
tests.append(test(random.randint(-10**18, 10**18), alea(50)))
tests.append(test(random.randint(-1000, 1000), alea(1000)))
# grands tests : tourner cran par cran serait bien trop long
tests.append(test(10**18, alea(40000)))
tests.append(test(-10**18 + 1, alea(40000)))
tests.append(test(9999, list(range(0, 1000)) * 10))
print(json.dumps(tests))
