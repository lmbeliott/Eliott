import json, random
random.seed(2026)


def simuler_et_filtrer(hh, ww, blocs):
    # Garde les blocs tant que leur place d'apparition est libre.
    g = [["."] * ww for _ in range(hh)]
    gardes = []
    for h, w, c in blocs:
        c0 = c - 1
        if any(g[i][j] == "#" for i in range(h) for j in range(c0, c0 + w)):
            break
        gardes.append((h, w, c))
        r = 0
        while r + 1 + h <= hh and all(g[i][j] == "." for i in range(r + 1, r + 1 + h) for j in range(c0, c0 + w)):
            r += 1
        for i in range(r, r + h):
            for j in range(c0, c0 + w):
                g[i][j] = "#"
        g = [["."] * ww for _ in range(sum(1 for l in g if "." not in l))] + [l for l in g if "." in l]
    return gardes


def test(hh, ww, blocs, filtrer=True):
    if filtrer:
        blocs = simuler_et_filtrer(hh, ww, blocs)
    return f"{hh} {ww} {len(blocs)}\n" + "".join(f"{h} {w} {c}\n" for h, w, c in blocs)


def arrivee(g, h, w, c0):
    hh = len(g)
    if any(g[i][j] == "#" for i in range(h) for j in range(c0, c0 + w)):
        return -1
    r = 0
    while r + 1 + h <= hh and all(g[i][j] == "." for i in range(r + 1, r + 1 + h) for j in range(c0, c0 + w)):
        r += 1
    return r


def aleatoires(hh, ww, q, hmax, wmax, p_malin=0.8):
    # Un joueur qui pose le plus souvent le bloc là où il descend le plus bas.
    g = [["."] * ww for _ in range(hh)]
    blocs = []
    for _ in range(q):
        h = random.randint(1, min(hmax, hh))
        w = random.randint(1, min(wmax, ww))
        options = []
        for c0 in range(ww - w + 1):
            r = arrivee(g, h, w, c0)
            if r >= 0:
                trous = 0
                for j in range(c0, c0 + w):
                    i = r + h
                    while i < hh and g[i][j] == ".":
                        trous += 1
                        i += 1
                options.append((r - 3 * trous, r, c0))
        if not options:
            break
        if random.random() < p_malin:
            best = max(o[0] for o in options)
            options = [o for o in options if o[0] == best]
        _, r, c0 = random.choice(options)
        blocs.append((h, w, c0 + 1))
        for i in range(r, r + h):
            for j in range(c0, c0 + w):
                g[i][j] = "#"
        g = [["."] * ww for _ in range(sum(1 for l in g if "." not in l))] + [l for l in g if "." in l]
    return blocs


tests = [test(6, 4, [(1, 2, 1), (2, 1, 4), (1, 2, 2), (1, 1, 1), (2, 2, 3)]),
         test(5, 5, [(2, 3, 1), (1, 2, 4), (3, 1, 2), (1, 2, 4)])]
tests.append(test(1, 1, [(1, 1, 1)] * 200))
tests.append(test(3, 1, [(2, 1, 1), (1, 1, 1)]))
tests.append(test(30, 15, [(30, 15, 1)] * 200))
tests.append(test(4, 6, [(1, 3, 1), (1, 3, 4)] * 100))
# Deux colonnes qui se remplissent : plusieurs lignes pleines à la fois.
tests.append(test(10, 2, [(3, 1, 1), (2, 1, 1), (5, 1, 2), (1, 1, 1)]))
tests.append(test(8, 3, [(1, 1, 2), (3, 1, 1), (1, 1, 2), (3, 1, 3), (1, 1, 2)]))
tests.append(test(30, 15, aleatoires(30, 15, 200, 2, 4, 0.95)))
tests.append(test(30, 15, aleatoires(30, 15, 200, 2, 3, 0.97)))
tests.append(test(30, 8, aleatoires(30, 8, 200, 4, 2, 0.9)))
tests.append(test(20, 10, aleatoires(20, 10, 200, 2, 4, 0.95)))
tests.append(test(25, 12, aleatoires(25, 12, 200, 3, 6, 0.5)))
print(json.dumps(tests))
