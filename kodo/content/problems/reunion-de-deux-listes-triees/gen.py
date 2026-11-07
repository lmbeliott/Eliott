import json, random
random.seed(2026)

def test(a, b):
    return f"{len(a)}\n{' '.join(map(str, a))}\n{len(b)}\n{' '.join(map(str, b))}\n"

def alea(n, hi):
    return sorted(random.randint(0, hi) for _ in range(n))

tests = [test([1, 3, 3, 8], [2, 3, 9]), test([5, 5, 5], [5])]
tests.append(test([0], [100000]))
tests.append(test([7], [7]))
tests.append(test([1, 2, 3], [4, 5, 6]))            # l'une après l'autre
tests.append(test([4, 5, 6], [1, 2, 3]))
tests.append(test([2, 4, 6, 8], [1, 3, 5, 7, 9]))   # entrelacées
tests.append(test(alea(30, 20), alea(25, 20)))
tests.append(test(alea(500, 100000), alea(700, 1000)))
# grands tests : vérifier chaque valeur dans le résultat serait trop lent
tests.append(test(alea(12000, 100000), alea(12000, 100000)))
tests.append(test(list(range(0, 24000, 2)), list(range(1, 24000, 2))))
tests.append(test(alea(12000, 3000), alea(1, 100000)))
print(json.dumps(tests))
