import json, random
random.seed(2034)

def test(g):
    return f"{len(g)} {len(g[0])}\n" + "\n".join(g) + "\n"

def hasard(r, c, lettres):
    return ["".join(random.choice(lettres) for _ in range(c)) for _ in range(r)]

def serpent(r, c):
    # lignes paires pleines, reliées alternativement à droite puis à gauche
    g = [["b"] * c for _ in range(r)]
    for i in range(r):
        if i % 2 == 0:
            for j in range(c): g[i][j] = "a"
        else:
            g[i][c - 1 if i % 4 == 1 else 0] = "a"
    return ["".join(l) for l in g]

tests = []
tests.append(test(["aabba", "abbba", "aacca", "cccab"]))
tests.append(test(["xyx", "yxy", "xyx"]))
tests.append(test(["z"]))
tests.append(test(["a" * 300]))
tests.append(test(["a"] * 300))
tests.append(test(serpent(300, 300)))
tests.append(test(["".join("ab"[(i + j) % 2] for j in range(300)) for i in range(300)]))
tests.append(test(hasard(300, 300, "ab")))
tests.append(test(hasard(300, 300, "abcdefghijklmnopqrstuvwxyz")))
tests.append(test(hasard(7, 9, "ab")))
tests.append(test(hasard(40, 25, "abc")))
tests.append(test(hasard(150, 200, "aaab")))
print(json.dumps(tests))
