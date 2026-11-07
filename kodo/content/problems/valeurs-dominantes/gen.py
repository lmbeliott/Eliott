import json, random
random.seed(2026)

def test(liste):
    return f"{len(liste)}\n" + " ".join(map(str, liste)) + "\n"

def hasard(n, haut=100000):
    return [random.randint(0, haut) for _ in range(n)]

def decroissante(n):
    # Toutes les valeurs sont dominantes : le cas le plus lent pour la méthode naïve.
    return [100000 - 5 * i - random.randint(0, 4) for i in range(n)]

def presque_decroissante(n):
    # Une longue descente, avec des paliers de valeurs égales et quelques remontées.
    liste, v = [], 100000
    for _ in range(n):
        r = random.random()
        if r < 0.15:
            pass                                # même valeur que la précédente
        elif r < 0.2:
            v = min(100000, v + random.randint(1, 30))
        else:
            v = max(0, v - random.randint(1, 8))
        liste.append(v)
    return liste

tests = [test([5, 9, 3, 7, 7, 2, 6, 1]), test([1, 2, 3, 4])]
tests += [
    test([42]),                                 # une seule valeur
    test([0, 0, 0, 0, 0]),                      # toutes égales : seule la dernière
    test([4, 3, 2, 1, 0]),                      # toutes dominantes
    test([3, 1, 3, 1, 3]),
    test([100000, 0, 0, 0, 100000]),
    test([7, 7, 6, 6, 5, 5]),                   # paliers : la seconde de chaque paire
    test([0, 100000]),
    test(hasard(30, 20)),
    test(hasard(1000, 50)),
    test(hasard(5000)),
    test(decroissante(20000)),
    test(presque_decroissante(20000)),
    test(hasard(20000, 9)),
]
print(json.dumps(tests))
