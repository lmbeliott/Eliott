import json, random
random.seed(2026)

def test(k, motif, questions):
    lignes = [f"{len(motif)} {k} {len(questions)}"] + motif
    lignes += [f"{l1} {c1} {l2} {c2}" for l1, c1, l2, c2 in questions]
    return "\n".join(lignes) + "\n"

def motif_aleatoire(m, proba):
    return ["".join("#" if random.random() < proba else "." for _ in range(m)) for _ in range(m)]

def questions(n, q):
    qs = [(1, 1, n, n), (1, 1, 1, 1), (n, n, n, n)]
    while len(qs) < q:
        genre = random.randint(0, 3)
        l1, l2 = sorted(random.randint(1, n) for _ in range(2))
        c1, c2 = sorted(random.randint(1, n) for _ in range(2))
        if genre == 1:
            c1, c2 = 1, n                  # des lignes entières
        elif genre == 2:
            l1, l2 = 1, n                  # des colonnes entières
        elif genre == 3:
            l2 = l1 + random.randint(0, min(5, n - l1))   # une bande fine
        qs.append((l1, c1, l2, c2))
    return qs

TAPIS = ["###", "#.#", "###"]
tests = [
    test(2, TAPIS, [(1, 1, 9, 9), (4, 4, 6, 6), (2, 1, 2, 9), (3, 2, 7, 8)]),
    test(3, ["#.", "##"], [(1, 1, 8, 8), (5, 1, 8, 4), (1, 2, 8, 2)]),
    test(0, ["##", ".#"], [(1, 1, 1, 1)]),                 # ordre 0 : une seule case pleine
    test(4, ["..", ".."], [(1, 1, 16, 16), (3, 5, 9, 9)]),    # motif vide
    test(3, ["###", "###", "###"], [(1, 1, 27, 27), (2, 3, 20, 17)]),   # motif plein
    test(5, ["#..", "...", "..."], questions(243, 8)),     # une seule case pleine à chaque ordre
    test(4, motif_aleatoire(4, 0.6), questions(256, 30)),
    test(3, motif_aleatoire(5, 0.5), questions(125, 30)),
]
# tailles maximales : des grilles d'environ 10⁹ × 10⁹ cases
tests.append(test(29, ["##", "#."], questions(2 ** 29, 1000)))
tests.append(test(29, ["##", "##"], questions(2 ** 29, 1000)))
tests.append(test(18, ["#.#", "###", ".##"], questions(3 ** 18, 1000)))
tests.append(test(14, motif_aleatoire(4, 0.7), questions(4 ** 14, 1000)))
tests.append(test(12, motif_aleatoire(5, 0.6), questions(5 ** 12, 1000)))
print(json.dumps(tests))
