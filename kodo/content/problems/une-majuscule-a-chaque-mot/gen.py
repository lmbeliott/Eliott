import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"


def mot(l):
    return "".join(random.choice(LETTRES) for _ in range(l))


def test(mots):
    return f"{len(mots)}\n" + " ".join(mots) + "\n"


tests = [test(["bONjour", "LE", "monde"]), test(["a", "B", "cD", "Ef"])]
tests.append(test(["x"]))
tests.append(test(["Z"]))
tests.append(test(["DEJA", "TOUT", "EN", "MAJUSCULES"]))
tests.append(test(["Correct", "Deja"]))
tests.append(test(["minuscules", "partout", "ici"]))
tests.append(test([mot(50) for _ in range(10)]))
tests.append(test([mot(random.randint(1, 50)) for _ in range(1000)]))
tests.append(test([mot(1) for _ in range(300)]))
print(json.dumps(tests))
