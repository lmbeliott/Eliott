import json, random
random.seed(2026)

def test(liste):
    assert 1 in liste
    return f"{len(liste)}\n" + " ".join(map(str, liste)) + "\n"

def hasard(n, p):
    liste = [1 if random.random() < p else 0 for _ in range(n)]
    if 1 not in liste:
        liste[random.randrange(n)] = 1
    return liste

tests = [test([1, 0, 1, 0, 0, 1]), test([0, 1, 1, 0, 1, 0, 0, 0, 1, 1])]
tests += [
    test([1]),                                  # une seule valeur
    test([0, 0, 1, 0, 0]),                      # un seul 1 : rien à faire
    test([1, 1, 1, 1]),                         # que des 1
    test([0, 1, 1, 1, 0, 0]),                   # déjà regroupés
    test([1, 0, 0, 0, 0, 1]),                   # les deux bouts
    test([1, 0, 1, 0, 1, 0, 1, 0, 1]),
    test([1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1]),    # le petit groupe rejoint le grand
    test(hasard(40, 0.4)),
    test(hasard(1000, 0.1)),
    test([1, 0] * 25000),                       # le plus de 0 et de 1 mélangés
    test(hasard(50000, 0.5)),
    test([1] * 12500 + [0] * 25000 + [1] * 12500),
    test(hasard(30000, 0.97)),
]
print(json.dumps(tests))
