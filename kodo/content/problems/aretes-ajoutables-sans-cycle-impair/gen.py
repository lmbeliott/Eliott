import json, random
random.seed(2033)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes):
    p = list(range(1, n + 1))
    random.shuffle(p)
    nom = [0] + p
    aretes = [(nom[a], nom[b]) if random.random() < 0.5 else (nom[b], nom[a]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

def biparti(n, m, gauche):
    s = set()
    while len(s) < m:
        s.add((random.randint(1, gauche), random.randint(gauche + 1, n)))
    return list(s)

tests = []
tests.append(test(4, [(1, 2), (2, 3)]))
tests.append(test(5, [(1, 2), (2, 3), (3, 1), (4, 5)]))
tests.append(test(6, [(1, 2), (3, 4), (4, 5)]))
tests.append(test(1, []))
tests.append(test(2, [(1, 2)]))
tests.append(test(100000, []))
tests.append(test(100000, renomme(100000, biparti(100000, 9000, 50000))))
# un arbre de 9 001 sommets parmi 100 000
tests.append(test(100000, renomme(100000, [(i, random.randint(1, i - 1)) for i in range(2, 9002)])))
# grand cycle pair puis grand cycle impair
tests.append(test(6000, renomme(6000, [(i, i % 6000 + 1) for i in range(1, 6001)])))
tests.append(test(5999, renomme(5999, [(i, i % 5999 + 1) for i in range(1, 6000)])))
# graphe biparti complet 60 x 60, et quelques sommets isolés
tests.append(test(130, renomme(130, [(a, b) for a in range(1, 61) for b in range(61, 121)])))
for n, m, g in [(10, 6, 4), (300, 250, 120), (5000, 4000, 2000)]:
    tests.append(test(n, renomme(n, biparti(n, m, g))))
print(json.dumps(tests))
