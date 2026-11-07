import json, random
random.seed(2026)


def test(k, g):
    return f"{len(g)} {len(g[0])} {k}\n" + "".join(r + "\n" for r in g)


def aleatoire(n, m, p):
    return ["".join("#" if random.random() < p else "." for _ in range(m)) for _ in range(n)]


def placer(n, m, motif, i0, j0):
    g = [["."] * m for _ in range(n)]
    for i, r in enumerate(motif):
        for j, c in enumerate(r):
            g[i0 + i][j0 + j] = c
    return ["".join(r) for r in g]


planeur = [".#.", "..#", "###"]
tests = [test(1, [".....", "..#..", "..#..", "..#..", "....."]), test(4, placer(6, 6, planeur, 0, 0))]
tests.append(test(0, ["#.#", ".#."]))
tests.append(test(5, ["#"]))
tests.append(test(3, ["##", "##"]))
tests.append(test(1, ["#" * 25] * 25))
tests.append(test(100, placer(25, 25, planeur, 0, 0)))
tests.append(test(37, placer(20, 25, planeur, 2, 3)))
tests.append(test(100, ["." * 25] * 25))
# Le « r-pentomino », qui évolue longtemps.
tests.append(test(100, placer(25, 25, [".##", "##.", ".#."], 11, 11)))
tests.append(test(100, aleatoire(25, 25, 0.35)))
tests.append(test(57, aleatoire(25, 13, 0.5)))
tests.append(test(10, aleatoire(1, 25, 0.8)))
print(json.dumps(tests))
