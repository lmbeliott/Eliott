import json, random
random.seed(2026)

NOMS = ("marmotte chamois igloo yeti aigle bouquetin dragon ours ourson chalet sapin "
        "telepherique lynx renard hibou edelweiss refuge piolet luge skieur bonhomme "
        "chouette loup tetras lievre chamoisette dameuse cabane etoile comete").split()

def test(votes):
    return f"{len(votes)}\n" + "".join(f"{nom} {p}\n" for nom, p in votes)

def hasard(n, k):
    noms = random.sample(NOMS, k)
    return test([(random.choice(noms), random.randint(1, 5)) for _ in range(n)])

tests = [
    test([("marmotte", 3), ("chamois", 5), ("marmotte", 4), ("igloo", 2), ("chamois", 1), ("igloo", 5)]),
    test([("yeti", 2), ("aigle", 1), ("yeti", 1), ("bouquetin", 3)]),
]
# Cas limites : un seul vote, une seule sculpture, toutes à égalité,
# des noms qui commencent pareil (ours, ourson ; chamois, chamoisette).
tests.append(test([("comete", 4)]))
tests.append(test([("lynx", 5)] * 7))
tests.append(test([(nom, 3) for nom in ["sapin", "aigle", "ours", "ourson", "chalet", "refuge"]]))
tests.append(test([("ourson", 2), ("ours", 1), ("chamoisette", 4), ("chamois", 3), ("ours", 1), ("chamois", 1)]))
tests.append(test([("zebre", 1), ("abeille", 1), ("zebre", 1), ("abeille", 1)]))
# Cas aléatoires : peu de sculptures (beaucoup d'égalités) ou beaucoup.
for (n, k) in [(12, 4), (50, 10), (200, 6), (1000, 30), (1000, 3), (999, 15)]:
    tests.append(hasard(n, k))
# Totaux construits pour être tous égaux.
votes = [(nom, 5) for nom in NOMS for _ in range(4)] + [(nom, 4) for nom in NOMS for _ in range(5)]
random.shuffle(votes)
tests.append(test(votes))
print(json.dumps(tests))
