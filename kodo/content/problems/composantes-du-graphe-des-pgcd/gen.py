import json, random
random.seed(4203)


def texte(n, seuils):
    return f"{n} {len(seuils)}\n" + " ".join(map(str, seuils)) + "\n"


tests = [texte(10, [1, 2, 3, 4, 6]), texte(30, [2, 5, 7, 10, 15, 16])]
tests.append(texte(1, [1]))
tests.append(texte(2, [2, 1]))
tests.append(texte(100, list(range(1, 101))))
tests.append(texte(997, random.sample(range(1, 998), 50)))
tests.append(texte(5000, [random.randint(1, 5000) for _ in range(200)]))
# grands
tests.append(texte(100000, [random.randint(1, 100000) for _ in range(20000)]))
tests.append(texte(99999, [random.randint(1, 300) for _ in range(20000)]))
tests.append(texte(77777, list(range(1, 15001))))
tests.append(texte(100000, [1, 2, 3, 100000, 50000, 50001, 33333, 33334]))
print(json.dumps(tests))
