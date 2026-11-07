import json, random
random.seed(2030)

def test(n, aretes):
    lignes = [f"{n} {len(aretes)}"] + [f"{a} {b}" for a, b in aretes]
    return "\n".join(lignes) + "\n"

def renomme(n, aretes):
    p = list(range(1, n + 1))
    random.shuffle(p)
    nom = [0] + p
    aretes = [(nom[a], nom[b]) for a, b in aretes]
    random.shuffle(aretes)
    return aretes

def biparti(n, m, gauche):
    # arêtes entre {1..gauche} et {gauche+1..n}
    return [(random.randint(1, gauche), random.randint(gauche + 1, n)) for _ in range(m)]

tests = []
tests.append(test(4, [(1, 2), (2, 3)]))
tests.append(test(3, [(1, 2), (2, 3), (3, 1)]))
tests.append(test(5, [(1, 2), (2, 3), (3, 4), (4, 1)]))
tests.append(test(1, []))
tests.append(test(1, [(1, 1)]))
tests.append(test(2, [(1, 2), (2, 1), (1, 2)]))
tests.append(test(100000, []))                       # 2^100000
tests.append(test(100000, renomme(100000, biparti(100000, 7000, 50000))))
# un long chemin, des cordes paires, puis une seule corde qui ferme un cycle impair
a = [(i, i + 1) for i in range(1, 5000)]
for _ in range(2000):
    x = random.randint(1, 5000)
    y = random.randint(1, 5000)
    if (x + y) % 2 == 1:
        a.append((x, y))
a.append((1000, 3000))
tests.append(test(100000, renomme(100000, a)))
# long cycle pair, puis long cycle impair
tests.append(test(6000, renomme(6000, [(i, i % 6000 + 1) for i in range(1, 6001)])))
tests.append(test(5999, renomme(5999, [(i, i % 5999 + 1) for i in range(1, 6000)])))
tests.append(test(5000, renomme(5000, biparti(5000, 4000, 2500) + [(4000, 4000)])))
for n, m in [(12, 8), (300, 200), (2000, 1500)]:
    tests.append(test(n, renomme(n, biparti(n, m, n // 2))))
tests.append(test(40, [(random.randint(1, 40), random.randint(1, 40)) for _ in range(20)]))
print(json.dumps(tests))
