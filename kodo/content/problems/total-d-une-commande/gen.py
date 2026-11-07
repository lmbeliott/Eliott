import json, random
random.seed(2026)

def test(catalogue, commande):
    s = f"{len(catalogue)}\n" + "".join(f"{nom} {prix}\n" for nom, prix in catalogue)
    s += f"{len(commande)}\n" + "".join(f"{nom} {q}\n" for nom, q in commande)
    return s

def nom():
    return "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(random.randint(3, 8)))

tests = [test([("pain", 2), ("lait", 1), ("fromage", 7)], [("lait", 3), ("pain", 2), ("beurre", 1), ("lait", 1)]),
         test([("stylo", 3), ("cahier", 4), ("stylo", 2)], [("stylo", 10), ("cahier", 1)])]
tests.append(test([("a", 5)], [("a", 1)]))
tests.append(test([("a", 5)], [("b", 1000)]))                     # rien de connu
tests.append(test([("x", 1), ("x", 2), ("x", 3)], [("x", 1)]))     # le dernier prix compte
tests.append(test([("vis", 10000)], [("vis", 1000)] * 3))
for n, m in [(10, 10), (100, 200), (1000, 1000), (1000, 1000)]:
    noms = [nom() for _ in range(n)]
    catalogue = [(random.choice(noms), random.randint(1, 10000)) for _ in range(n)]
    autres = [nom() for _ in range(50)]
    commande = [(random.choice(noms + autres), random.randint(1, 1000)) for _ in range(m)]
    tests.append(test(catalogue, commande))
# grand total : dépasse 2^31
noms = [nom() for _ in range(1000)]
catalogue = [(x, random.randint(9000, 10000)) for x in noms]
commande = [(random.choice(noms), random.randint(900, 1000)) for _ in range(1000)]
tests.append(test(catalogue, commande))
print(json.dumps(tests))
