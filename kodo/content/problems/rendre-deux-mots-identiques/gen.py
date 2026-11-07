import json, random
random.seed(4103)
L = "abcdefghijklmnopqrstuvwxyz"


def texte(regles, s, t):
    assert len(s) == len(t)
    return f"{len(regles)}\n" + "".join(f"{x} {y} {c}\n" for x, y, c in regles) + s + "\n" + t + "\n"


def regles_alea(m, lettres, cmax):
    return [(random.choice(lettres), random.choice(lettres), random.randint(1, cmax)) for _ in range(m)]


def mot(n, lettres):
    return "".join(random.choice(lettres) for _ in range(n))


tests = []
tests.append(texte([("a", "b", 2), ("c", "b", 1), ("b", "d", 5)], "abd", "cba"))
tests.append(texte([("a", "b", 4), ("c", "d", 1)], "ac", "bb"))
tests.append(texte([], "kodo", "kodo"))
tests.append(texte([], "a", "b"))
tests.append(texte([("x", "y", 7), ("x", "y", 3), ("y", "x", 10), ("x", "x", 1)], "xyxy", "yxxy"))
# se rejoindre sur une troisième lettre est moins cher que transformer l'une en l'autre
tests.append(texte([("a", "b", 100), ("a", "z", 1), ("b", "z", 1), ("b", "a", 100)], "ab" * 10, "ba" * 10))
# un cycle de transformations : chaque lettre peut devenir la suivante
tests.append(texte([(L[i], L[(i + 1) % 26], 1000) for i in range(26)], "az", "za"))
for m, n, lettres in [(10, 20, "abcde"), (40, 50, "abcdefghij"), (200, 100, L)]:
    tests.append(texte(regles_alea(m, lettres, 50), mot(n, lettres), mot(n, lettres)))
# grands : réponse dépassant 2³¹
regles = [(L[i], L[i + 1], 10 ** 6) for i in range(25)] + [(L[i + 1], L[i], 10 ** 6) for i in range(24, 12, -1)]
tests.append(texte(regles, "a" * 50000, "z" * 50000))
regles = regles_alea(1000, L, 10 ** 6)
tests.append(texte(regles, mot(50000, L), mot(50000, L)))
# grand avec une position impossible tout à la fin
regles = [(x, y, c) for x, y, c in regles_alea(400, L, 1000) if y != "q" and x != "q"]
tests.append(texte(regles, mot(49999, L.replace("q", "")) + "q", mot(49999, L.replace("q", "")) + "a"))
print(json.dumps(tests))
