import json, random
random.seed(2026)

def test(h):
    return f"{len(h)}\n{' '.join(map(str, h))}\n"

def alea(n, hi=1000):
    return [random.randint(0, hi) for _ in range(n)]

tests = [test([3, 0, 2, 0, 4]), test([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])]
tests.append(test([5]))
tests.append(test([2, 7]))
tests.append(test([1, 2, 3, 4, 5]))                   # montée : rien
tests.append(test([5, 4, 3, 2, 1]))
tests.append(test([4, 4, 4]))
tests.append(test([5, 0, 0, 0, 5]))
tests.append(test(alea(60, 10)))
tests.append(test(alea(3000)))
# grands tests : recalculer les maximums pour chaque colonne serait trop lent
tests.append(test([1000] + [0] * 29998 + [1000]))
tests.append(test(alea(30000)))
tests.append(test([abs(15000 - i) // 15 for i in range(30000)]))   # une vallée
print(json.dumps(tests))
