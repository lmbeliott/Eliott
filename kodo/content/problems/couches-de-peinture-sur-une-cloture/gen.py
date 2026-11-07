import json, random
random.seed(3302)

def test(n, coups):
    return f"{n} {len(coups)}\n" + "".join(f"{l} {r}\n" for l, r in coups)

def aleatoire(n, m, longs=False):
    coups = []
    for _ in range(m):
        if longs:
            l = random.randint(1, n // 5); r = random.randint(n - n // 5, n)
        else:
            l = random.randint(1, n); r = random.randint(l, min(n, l + random.randint(0, n // 3)))
        coups.append((l, r))
    return test(n, coups)

tests = [test(10, [(2, 5), (4, 8), (5, 6)]), test(6, [(1, 6), (1, 6)])]
tests.append(test(1, [(1, 1)]))
tests.append(test(5, [(5, 5)]))                         # écrit en R + 1 = N + 1
tests.append(test(8, [(1, 2), (3, 4), (5, 6), (7, 8)]))  # maximum 1 partout
tests.append(test(100000, [(50000, 50000)]))            # presque tout est sans peinture
tests.append(aleatoire(50, 20))
tests.append(aleatoire(5000, 500))
# grands tests : peindre planche par planche serait trop lent
tests.append(aleatoire(200000, 8000, True))
tests.append(aleatoire(200000, 8000))
print(json.dumps(tests))
