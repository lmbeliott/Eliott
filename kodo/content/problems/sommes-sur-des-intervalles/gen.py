import json, random
random.seed(2026)

def test(chiffres, questions):
    lignes = [f"{len(chiffres)} {len(questions)}", chiffres]
    lignes += [f"{a} {b}" for a, b in questions]
    return "\n".join(lignes) + "\n"

def chiffres_aleatoires(n):
    # beaucoup de zéros
    return "".join(random.choice("00001123456789") for _ in range(n))

def questions_aleatoires(n, q):
    res = []
    for _ in range(q):
        a, b = random.randint(1, n), random.randint(1, n)
        res.append((min(a, b), max(a, b)))
    return res

def questions_longues(n, q):
    # de longs intervalles : c'est le pire cas pour la solution naïve
    res = [(1, n), (1, 1), (n, n)]
    while len(res) < q:
        res.append((random.randint(1, n // 5), random.randint(4 * n // 5, n)))
    return res

tests = [
    test("3015002", [(1, 7), (2, 4), (6, 6)]),
    test("0090000120", [(1, 2), (3, 3), (1, 10), (4, 8)]),
    test("0", [(1, 1)]),
    test("9", [(1, 1), (1, 1)]),
    test("00000", [(1, 5), (2, 3), (5, 5)]),
    test("123456789", [(1, 9), (9, 9), (1, 1), (4, 6), (2, 8)]),
]
r = chiffres_aleatoires(60)
tests.append(test(r, questions_aleatoires(60, 25)))
r = chiffres_aleatoires(2000)
tests.append(test(r, questions_aleatoires(2000, 800)))
r = chiffres_aleatoires(15000)
tests.append(test(r, questions_aleatoires(15000, 1000)))
# deux tests de taille maximale
tests.append(test("9" * 100000, questions_longues(100000, 5000)))
r = chiffres_aleatoires(100000)
tests.append(test(r, questions_longues(100000, 5000)))
print(json.dumps(tests))
