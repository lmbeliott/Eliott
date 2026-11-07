import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes)

def hasard(h, w, alphabet=LETTRES):
    return test(["".join(random.choice(alphabet) for _ in range(w)) for _ in range(h)])

def numerotee(h, w):
    # Chaque case reçoit la lettre de son numéro de ligne + colonne : les erreurs se voient.
    return test(["".join(LETTRES[(l * 7 + c * 3) % 26] for c in range(w)) for l in range(h)])

tests = [
    test(["abcd", "efgh", "ijkl"]),
    test(["ab", "cd", "ef", "gh"]),
]
tests += [
    test(["x"]),                                # une seule case
    test(["abcdefg"]),                          # une seule ligne
    test(["a", "b", "c", "d", "e"]),            # une seule colonne
    test(["abc", "def", "ghi"]),                # carré impair : on finit au centre
    test(["abcd", "efgh", "ijkl", "mnop"]),     # carré pair
    test(["abcdef", "ghijkl"]),                 # deux lignes
    test(["ab", "cd", "ef", "gh", "ij", "kl", "mn"]),  # deux colonnes
    numerotee(5, 9),
    numerotee(9, 5),
    hasard(100, 100),
    hasard(1, 100),
    hasard(100, 1),
    hasard(37, 100),
    hasard(100, 64),
    hasard(99, 99, "ab"),
]
print(json.dumps(tests))
