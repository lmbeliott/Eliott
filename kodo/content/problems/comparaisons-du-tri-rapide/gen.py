import json, random
from math import gcd
random.seed(2026)

def test(n, a, b):
    assert gcd(a, n) == 1
    return f"{n} {a} {b}\n"

def a_premier(n):
    while True:
        a = random.randrange(n)
        if gcd(a, n) == 1:
            return a

tests = [test(5, 2, 3), test(7, 3, 0)]
tests.append(test(1, 0, 0))
tests.append(test(2, 1, 1))
tests.append(test(10, 1, 0))                   # déjà triée
tests.append(test(10, 9, 9))                   # triée à l'envers
tests.append(test(50, 7, 13))
tests.append(test(200000, 1, 0))               # déjà triée : N(N-1)/2
tests.append(test(200000, 199999, 199999))    # à l'envers
tests.append(test(199999, 1, 100000))          # deux blocs triés
tests.append(test(200000, 3, 5))
tests.append(test(199999, 2, 7))
n = 200000
tests.append(test(n, a_premier(n), random.randrange(n)))
n = 199933
tests.append(test(n, a_premier(n), random.randrange(n)))
print(json.dumps(tests))
