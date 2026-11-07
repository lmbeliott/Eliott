import json, random
random.seed(2026)

MAX = 100000


def fmt(h, w, pieges, bonus):
    lignes = [f"{h} {w} {len(pieges)} {len(bonus)}"]
    lignes += [f"{l} {c}" for l, c in pieges] + [f"{l} {c}" for l, c in bonus]
    return "\n".join(lignes) + "\n"


def cases_distinctes(h, w, nb, interdites=()):
    vues = set(interdites) | {(1, 1), (h, w)}
    res = []
    while len(res) < nb:
        p = (random.randint(1, h), random.randint(1, w))
        if p not in vues:
            vues.add(p)
            res.append(p)
    return res


def chaine(h, w, nb):
    # Cases toutes comparables deux à deux (lignes et colonnes croissantes) : le pire cas
    ls = sorted(random.sample(range(2, h), nb))
    cs = sorted(random.sample(range(2, w), nb))
    pts = list(zip(ls, cs))
    random.shuffle(pts)
    return pts


tests = [
    fmt(3, 4, [(2, 2)], [(1, 3)]),
    fmt(4, 4, [(3, 2)], [(2, 2), (3, 3)]),
]
# Cas limites : aucun bonus, une seule ligne, départ bloqué
tests.append(fmt(5, 5, [(2, 3)], []))
tests.append(fmt(1, 8, [], [(1, 4)]))
tests.append(fmt(1, 8, [(1, 6)], [(1, 4)]))
tests.append(fmt(6, 7, [(1, 2), (2, 1)], [(3, 3)]))
tests.append(fmt(6, 7, [], [(2, 2), (2, 3), (3, 2), (5, 6)]))
pts = cases_distinctes(12, 15, 25)
tests.append(fmt(12, 15, pts[:12], pts[12:]))
pts = cases_distinctes(60, 50, 200)
tests.append(fmt(60, 50, pts[:120], pts[120:]))
# Grands cas : grille immense, cases spéciales nombreuses
pts = cases_distinctes(MAX, MAX, 1500)
tests.append(fmt(MAX, MAX, pts[:750], pts[750:]))
pts = chaine(MAX, MAX, 1500)
tests.append(fmt(MAX, MAX, pts[:1000], pts[1000:]))
pts = chaine(MAX, 77777, 1500)
tests.append(fmt(MAX, 77777, pts[::3], [p for i, p in enumerate(pts) if i % 3]))
# Beaucoup de cases spéciales concentrées près du départ et de l'arrivée
pts = cases_distinctes(40, 40, 600) + [(MAX - a, MAX - b) for a, b in cases_distinctes(40, 40, 600)]
random.shuffle(pts)
tests.append(fmt(MAX, MAX, pts[:700], pts[700:]))
# Un seul bonus, très loin du chemin direct
tests.append(fmt(MAX, MAX, cases_distinctes(MAX, MAX, 1000), [(MAX, 1)]))
print(json.dumps(tests))
