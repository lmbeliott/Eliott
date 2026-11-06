import json, random
random.seed(2026)


def fmt(w, objets):
    return f"{len(objets)} {w}\n" + "".join(f"{p} {v}\n" for p, v in objets)


tests = [
    fmt(10, [(5, 10), (4, 40), (6, 30), (3, 50)]),
    fmt(7, [(2, 15), (4, 20), (6, 1)]),
]
tests.append(fmt(5, [(5, 0)]))
tests.append(fmt(5, [(6, 100)]))
tests.append(fmt(5, [(3, 10), (2, 0), (4, 50)]))      # l'objet de valeur 0 est indispensable
tests.append(fmt(12, [(4, 5), (4, 5), (4, 5), (4, 5)]))  # objets identiques
objets = [(random.randint(1, 50), random.randint(0, 100)) for _ in range(15)]
tests.append(fmt(sum(p for p, _ in objets), objets))        # il faut tout prendre
tests.append(fmt(300, [(random.randint(1, 120), random.randint(0, 1000)) for _ in range(20)]))
# Poids égaux : on prend les 50 objets de plus grande valeur.
tests.append(fmt(5000, [(100, random.randint(0, 1000)) for _ in range(100)]))
# Grands cas.
tests.append(fmt(10000, [(random.randint(1, 10000), random.randint(0, 1000)) for _ in range(100)]))
tests.append(fmt(10000, [(random.randint(50, 400), random.randint(0, 1000)) for _ in range(100)]))
tests.append(fmt(9999, [(random.randint(1, 1400) * 7, random.randint(0, 1000)) for _ in range(100)]))
tests.append(fmt(9973, [(random.randint(80, 220), random.randint(400, 1000)) for _ in range(100)]))
print(json.dumps(tests))
