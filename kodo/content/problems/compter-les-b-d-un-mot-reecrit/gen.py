import json, random
random.seed(2026)

LIMITE = 10**18

def longueur_finale(e, u, w):
    lg = {'a': 1, 'b': 1}
    for _ in range(e):
        lg = {'a': min(2 * LIMITE, sum(lg[d] for d in u)),
              'b': min(2 * LIMITE, sum(lg[d] for d in w))}
    return min(LIMITE, lg['a'])

def test(e, u, w, questions):
    return f"{e} {len(questions)}\n{u}\n{w}\n" + "".join(f"{k}\n" for k in questions)

def questions_aleatoires(e, u, w, q):
    n = longueur_finale(e, u, w)
    ks = [1, n, max(1, n - 1), max(1, n // 2)]
    while len(ks) < q:
        ks.append(random.randint(1, n))
    random.shuffle(ks)
    return ks[:q]

def mot(longueur):
    return "".join(random.choice("ab") for _ in range(longueur))

tests = [
    test(4, "ab", "a", [3, 5, 8]),
    test(3, "abb", "ba", [1, 4, 10, 17]),
    test(0, "ab", "b", [1]),                        # étape 0 : le mot « a »
    test(60, "b", "a", [1]),                        # la longueur ne change jamais
    test(60, "aa", "bb", [1, 10**18]),              # que des a
    test(60, "ab", "b", [1, 30, 61]),               # longueur qui grandit lentement
    test(60, "ab", "bb", [1, 2, 10**18, 10**18 - 1]),
    test(2, "babab", "aabba", questions_aleatoires(2, "babab", "aabba", 10)),
]
# grands tests : mots de longueur astronomique
for e, u, w in [(60, "ab", "a"), (60, "abbab", "ba"), (45, "bbabb", "aabaa"),
                (60, mot(5), mot(5)), (60, mot(3), mot(4)), (37, "aba", "bab")]:
    tests.append(test(e, u, w, questions_aleatoires(e, u, w, 1000)))
print(json.dumps(tests))
