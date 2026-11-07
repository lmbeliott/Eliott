import json, random
random.seed(3103)

def presque_triee(n, k):
    # chaque valeur i reçoit la clé i + u avec 0 ≤ u < k : elle bouge de moins de k positions
    cles = [(i + random.random() * k, i) for i in range(1, n + 1)]
    cles.sort()
    return [v for _, v in cles]

def blocs_retournes(n):
    # blocs de 11 valeurs retournés : chaque valeur bouge d'au plus 10 positions
    t = list(range(1, n + 1))
    res = []
    for d in range(0, n, 11):
        res.extend(reversed(t[d:d + 11]))
    return res

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([2, 1, 3, 5, 4]), test([3, 1, 2, 6, 4, 5, 7])]
tests.append(test([1]))
tests.append(test(list(range(1, 21))))           # déjà triée
tests.append(test(list(range(11, 0, -1))))       # un seul bloc retourné : 55 désordres
tests.append(test(presque_triee(40, 4)))
tests.append(test(presque_triee(2000, 10)))
tests.append(test(blocs_retournes(3000)))
# grands tests : compter toutes les paires serait trop lent
tests.append(test(presque_triee(25000, 11)))
tests.append(test(blocs_retournes(25000)))
print(json.dumps(tests))
