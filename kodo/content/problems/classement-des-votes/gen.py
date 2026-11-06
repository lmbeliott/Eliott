import json, random
random.seed(2026)

NOMS = ("rouge vert bleu jaune orange violet rose gris noir blanc marron beige turquoise "
        "indigo cyan magenta ocre or argent bordeaux kaki lilas mauve corail ivoire "
        "saumon ambre emeraude prune creme bleuet").split()

def test(votes):
    return f"{len(votes)}\n" + "".join(f"{nom} {p}\n" for nom, p in votes)

def hasard(n, k):
    noms = random.sample(NOMS, k)
    return test([(random.choice(noms), random.randint(1, 5)) for _ in range(n)])

tests = [
    test([("rouge", 3), ("vert", 5), ("rouge", 4), ("bleu", 2), ("vert", 1), ("bleu", 5)]),
    test([("violet", 2), ("jaune", 1), ("violet", 1), ("blanc", 3)]),
]
# Cas limites : un seul vote, une seule couleur, toutes à égalité,
# des noms qui commencent pareil (or, orange ; bleu, bleuet).
tests.append(test([("gris", 4)]))
tests.append(test([("noir", 5)] * 7))
tests.append(test([(nom, 3) for nom in ["rose", "jaune", "or", "orange", "beige", "marron"]]))
tests.append(test([("orange", 2), ("or", 1), ("bleuet", 4), ("bleu", 3), ("or", 1), ("bleu", 1)]))
tests.append(test([("violet", 1), ("ambre", 1), ("violet", 1), ("ambre", 1)]))
# Cas aléatoires : peu de couleurs (beaucoup d'égalités) ou beaucoup.
for (n, k) in [(12, 4), (50, 10), (200, 6), (1000, 30), (1000, 3), (999, 15)]:
    tests.append(hasard(n, k))
# Totaux construits pour être tous égaux.
votes = [(nom, 5) for nom in NOMS for _ in range(4)] + [(nom, 4) for nom in NOMS for _ in range(5)]
random.shuffle(votes)
tests.append(test(votes))
print(json.dumps(tests))
