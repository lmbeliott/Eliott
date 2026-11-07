import json, random
random.seed(2026)

N = 50000
LETTRES = "abcdefghijklmnopqrstuvwxyz"

def test(k, s):
    return f"{len(s)} {k}\n{s}\n"

def hasard(n, k):
    return "".join(random.choice(LETTRES[:k]) for _ in range(n))

def blocs(n, k, bruit):
    # des blocs qui contiennent chacun une fois chaque lettre, avec un peu de bruit :
    # beaucoup de sous-chaînes équilibrées
    s = []
    while len(s) < n:
        p = list(LETTRES[:k])
        random.shuffle(p)
        s += p
        if random.random() < bruit:
            s.append(random.choice(LETTRES[:k]))
    return "".join(s[:n])

tests = [
    test(2, "aabbab"),
    test(3, "cabbacbca"),
]
tests += [
    test(1, "a"),
    test(2, "a"),                                 # une lettre ne suffit pas
    test(2, "aaaa"),                              # le b n'apparaît jamais
    test(1, "aaaaaaaaaa"),                        # toutes les sous-chaînes
    test(3, "abcabcabc"),
    test(26, LETTRES + LETTRES[::-1]),
    test(4, blocs(200, 4, 0.2)),
    test(1, "a" * 100000),                        # la réponse dépasse 2^31
    test(2, hasard(N, 2)),
    test(3, blocs(N, 3, 0.1)),
    test(26, blocs(N, 26, 0.05)),
    test(26, "a" * 100000),                       # taille maximale, et chaque a change tous les écarts
    test(5, hasard(30000, 5)),
]
print(json.dumps(tests))
