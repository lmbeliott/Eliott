import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"

def hasard(n, alphabet=LETTRES):
    return "".join(random.choice(alphabet) for _ in range(n))

def sous_suite(chaine, n):
    # n lettres de la chaîne, prises dans l'ordre : la réponse est « OUI ».
    positions = sorted(random.sample(range(len(chaine)), n))
    return "".join(chaine[p] for p in positions)

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

def limite(chaine, alphabet):
    # On avance dans la chaîne avec des lettres au hasard jusqu'à la dépasser :
    # le mot obtenu est « NON » de justesse, et sans sa dernière lettre il est « OUI ».
    mot = ""
    p = 0
    while len(mot) < 100:
        c = random.choice(alphabet)
        i = chaine.find(c, p)
        mot += c
        if i < 0:
            return mot, mot[:-1]
        p = i + 1
    return mot, mot

def test(chaine, mots):
    return f"{chaine}\n{len(mots)}\n" + "".join(m + "\n" for m in mots)

tests = [
    test("programmes", ["rame", "mare", "gamme", "aa", "programmes"]),
    test("boulangeriedelagare", ["bouger", "orange", "gare", "lait", "rr"]),
]
# Cas limites : chaîne d'une lettre, mot plus long que la chaîne, lettres répétées.
tests.append(test("a", ["a", "b", "aa"]))
tests.append(test("abc", ["abc", "cba", "abcd", "ac", "b", "ca"]))
tests.append(test("aaaaabbbbb", ["aaaaa", "aaaaaa", "ab", "ba", "aabbb", "bbbbbb", "abababab"]))
tests.append(test("abababababab", ["aaaaaa", "aaaaaaa", "bbbbbb", "ba" * 6, "ab" * 6, "bab" * 4, "abba"]))
# Tests aléatoires : un mélange de mots trouvables et de mots abîmés.
for (n, alphabet, q) in [(50, "abc", 30), (300, "abcde", 50), (1000, LETTRES, 100),
                         (150, "ab", 100), (400, "abcd", 100), (1000, LETTRES, 100)]:
    chaine = hasard(n, alphabet)
    mots = []
    for _ in range(q):
        longueur = random.randint(1, min(100, n))
        r = random.random()
        if r < 0.3:
            mots.append(sous_suite(chaine, longueur))
        elif r < 0.55:
            non, oui = limite(chaine, alphabet)
            mots.append(non if random.random() < 0.5 else oui)
        elif r < 0.8:
            mots.append(abime(sous_suite(chaine, longueur), alphabet))
        else:
            mots.append(hasard(longueur, alphabet))
    tests.append(test(chaine, mots))
print(json.dumps(tests))
