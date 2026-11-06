import json, random
random.seed(2026)

def test(k, sentier):
    return f"{len(sentier)} {k}\n{sentier}\n"

def aleatoire(n, poids=(1, 1, 1)):
    return "".join(random.choices("MDP", weights=poids, k=n))

tests = [
    test(1, "MDDPMD"),
    test(2, "MMMMM"),
    test(1, "D"),
    test(1, "P"),
    test(3, "DDD"),
    test(1, "PPPPDPPPP"),
    test(2, "DMDMDDMDMD"),
]
tests.append(test(2, aleatoire(40)))
tests.append(test(5, aleatoire(3000, (1, 2, 1))))
# tests de taille maximale
tests.append(test(1, "D" * 50000))
tests.append(test(10, "P" * 45000 + "D" * 10 + "P" * 54990))   # réponse > 2^31
tests.append(test(3, aleatoire(100000)))
tests.append(test(40, aleatoire(100000, (2, 3, 4))))
print(json.dumps(tests))
