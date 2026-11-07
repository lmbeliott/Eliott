import json, random
random.seed(2026)

def test(grille, mots):
    s = f"{len(grille)} {len(grille[0])}\n" + "".join(l + "\n" for l in grille)
    return s + f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def grille_aleatoire(r, c, lettres):
    return ["".join(random.choice(lettres) for _ in range(c)) for _ in range(r)]

def mots_aleatoires(q, lettres, lmin, lmax, grille=None):
    mots = set()
    while len(mots) < q:
        if grille is not None and random.random() < 0.5:
            # un mot vraiment lu dans la grille
            r, c = len(grille), len(grille[0])
            i, j = random.randrange(r), random.randrange(c)
            di, dj = random.choice([(a, b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a, b) != (0, 0)])
            m = ""
            for _ in range(random.randint(lmin, lmax)):
                if 0 <= i < r and 0 <= j < c:
                    m += grille[i][j]
                    i += di
                    j += dj
            mots.add(m)
        else:
            mots.add("".join(random.choice(lettres) for _ in range(random.randint(lmin, lmax))))
    mots = sorted(mots)
    random.shuffle(mots)
    return mots

tests = [test(["chat", "aoxe", "tirn", "sole"], ["chat", "toit", "rie", "lit", "net", "ah"]),
         test(["abc", "def"], ["fed", "ae", "bf", "cf", "abcd"])]
tests.append(test(["z"], ["z", "zz", "a"]))
tests.append(test(["abcdefgh"], ["hgfedcba", "abcdefgh", "ace", "a", "fgh", "hh"]))
tests.append(test(["a", "b", "c"], ["abc", "cba", "ac", "b"]))
tests.append(test(["aaa", "aaa", "aaa"], ["a", "aa", "aaa", "aaaa"]))
for r, c, lettres, q, lmax in [(8, 8, "abcde", 100, 5), (20, 25, "abcdefghij", 1000, 8),
                               (30, 30, "abc", 2000, 8), (30, 30, "abcdefghijklmnopqrstuvwxyz", 2000, 8),
                               (1, 30, "ab", 300, 8), (30, 30, "ab", 400, 8)]:
    g = grille_aleatoire(r, c, lettres)
    tests.append(test(g, mots_aleatoires(q, lettres, 1, lmax, g)))
print(json.dumps(tests))
