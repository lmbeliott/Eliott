import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes)

def hasard(h, w, car):
    return test(["".join(random.choice(car) for _ in range(w)) for _ in range(h)])

tests = [test(["abc", "def"]), test(["#...", "##..", "#.#."])]
tests += [
    test(["x"]),                        # une seule case
    test(["abcdefghij"]),               # une seule ligne
    test(["a", "b", "c", "d"]),         # une seule colonne
    test(["ab", "cd"]),
    test(["#.", ".#"]),
    hasard(100, 100, ".#"),
    hasard(100, 1, "abcdefghijklmnopqrstuvwxyz"),
    hasard(1, 100, "abcdefghijklmnopqrstuvwxyz"),
    hasard(37, 81, ".#abc"),
    hasard(100, 63, "abcdefghijklmnopqrstuvwxyz.#"),
]
for _ in range(3):
    tests.append(hasard(random.randint(2, 12), random.randint(2, 12), "abcdefghijklmnopqrstuvwxyz.#"))
print(json.dumps(tests))
