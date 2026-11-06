import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"

def hasard(n, alphabet=LETTRES):
    return "".join(random.choice(alphabet) for _ in range(n))

def sous_suite(piste, n):
    # n lettres de la piste, prises dans l'ordre : la réponse est « oui ».
    positions = sorted(random.sample(range(len(piste)), n))
    return "".join(piste[p] for p in positions)

def abime(mot, alphabet):
    # On échange deux lettres voisines différentes, ou on remplace une lettre.
    m = list(mot)
    for _ in range(20):
        i = random.randrange(len(m) - 1) if len(m) > 1 else 0
        if len(m) > 1 and m[i] != m[i + 1]:
            m[i], m[i + 1] = m[i + 1], m[i]
            return "".join(m)
    m[random.randrange(len(m))] = random.choice(alphabet)
    return "".join(m)

def limite(piste, alphabet):
    # On avance sur la piste avec des lettres au hasard jusqu'à la dépasser :
    # le mot obtenu est « non » de justesse, et sans sa dernière lettre il est « oui ».
    mot = ""
    p = 0
    while len(mot) < 100:
        c = random.choice(alphabet)
        i = piste.find(c, p)
        mot += c
        if i < 0:
            return mot, mot[:-1]
        p = i + 1
    return mot, mot

def test(piste, mots):
    return f"{piste}\n{len(mots)}\n" + "".join(m + "\n" for m in mots)

tests = [
    test("marmottes", ["mot", "tom", "mars", "aa", "marmottes"]),
    test("refugedulacnoir", ["fondu", "lac", "noir", "glace", "rr"]),
]
# Cas limites : piste d'une lettre, mot plus long que la piste, lettres répétées.
tests.append(test("a", ["a", "b", "aa"]))
tests.append(test("abc", ["abc", "cba", "abcd", "ac", "b", "ca"]))
tests.append(test("aaaaabbbbb", ["aaaaa", "aaaaaa", "ab", "ba", "aabbb", "bbbbbb", "abababab"]))
tests.append(test("abababababab", ["aaaaaa", "aaaaaaa", "bbbbbb", "ba" * 6, "ab" * 6, "bab" * 4, "abba"]))
# Tests aléatoires : un mélange de mots trouvables et de mots abîmés.
for (n, alphabet, q) in [(50, "abc", 30), (300, "abcde", 50), (1000, LETTRES, 100),
                         (150, "ab", 100), (400, "abcd", 100), (1000, LETTRES, 100)]:
    piste = hasard(n, alphabet)
    mots = []
    for _ in range(q):
        longueur = random.randint(1, min(100, n))
        r = random.random()
        if r < 0.3:
            mots.append(sous_suite(piste, longueur))
        elif r < 0.55:
            non, oui = limite(piste, alphabet)
            mots.append(non if random.random() < 0.5 else oui)
        elif r < 0.8:
            mots.append(abime(sous_suite(piste, longueur), alphabet))
        else:
            mots.append(hasard(longueur, alphabet))
    tests.append(test(piste, mots))
print(json.dumps(tests))
