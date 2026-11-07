import json, random
random.seed(3104)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

def melange(n):
    t = list(range(1, n + 1))
    random.shuffle(t)
    return t

tests = [test([3, 1, 2]), test([2, 1, 4, 3])]
tests.append(test([1]))
tests.append(test([1, 2, 3, 4, 5]))                 # déjà triée
tests.append(test(list(range(10, 0, -1))))           # 5 cycles de 2 : 5 échanges
tests.append(test(list(range(2, 13)) + [1]))         # un seul grand cycle : 11 échanges
tests.append(test(melange(8)))
tests.append(test(melange(300)))
tests.append(test(melange(5000)))
# grands tests : un tri par sélection qui cherche le minimum serait trop lent
tests.append(test(melange(25000)))
tests.append(test(list(range(2, 25001)) + [1]))
print(json.dumps(tests))
