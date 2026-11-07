import json, random
random.seed(2026)


def test(vals):
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"


tests = [test([3, 0, 1, 7, 1]), test([5, 9, 2])]
tests.append(test([0]))
tests.append(test([1]))
tests.append(test([1000000000]))
tests.append(test([2, 1, 0]))                             # réponse N
perm = list(range(20000))
random.shuffle(perm)
tests.append(test(perm))                                  # réponse N, taille maximale
p = list(range(20000))
p[12345] = 10**9
random.shuffle(p)
tests.append(test(p))                                     # il manque 12345
tests.append(test([0] * 20000))
tests.append(test([random.randint(0, 10**9) for _ in range(5000)]))
q = [random.randint(0, 3000) for _ in range(15000)]
tests.append(test(q))
tests.append(test([x for x in range(1, 401)] + [0, 0, 401, 403]))
print(json.dumps(tests))
