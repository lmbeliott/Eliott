import json, random
random.seed(3301)

def test(m, questions):
    lignes = [f"{len(m)} {len(questions)}", " ".join(map(str, m))]
    lignes += [f"{l} {r}" for l, r in questions]
    return "\n".join(lignes) + "\n"

def aleatoire(n, q, longues=False, amplitude=999):
    m = [random.randint(-amplitude, amplitude) for _ in range(n)]
    qs = []
    for _ in range(q):
        if longues:
            l = random.randint(1, n // 10 + 1); r = random.randint(n - n // 10 - 1, n)
            l, r = min(l, r), max(l, r)
        else:
            l = random.randint(1, n); r = random.randint(l, n)
        qs.append((l, r))
    return test(m, qs)

tests = [test([120, -40, 15, -200, 60], [(1, 5), (2, 3), (4, 4)]),
         test([5, 5, -10, 3], [(1, 3), (3, 4), (1, 1)])]
tests.append(test([7], [(1, 1)]))
tests.append(test([-999] * 10, [(1, 10), (5, 5), (3, 7)]))
tests.append(test([1, -1] * 20, [(1, 40), (1, 39), (2, 40), (10, 21)]))
tests.append(aleatoire(100, 50))
tests.append(aleatoire(3000, 1000))
# grands tests : additionner chaque portion serait trop lent
tests.append(aleatoire(50000, 10000, True, 9))     # petites valeurs pour garder l'entrée courte
tests.append(aleatoire(15000, 5000, True))
print(json.dumps(tests))
