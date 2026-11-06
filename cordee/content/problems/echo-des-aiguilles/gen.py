import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"

def mot_au_hasard(n, alphabet=LETTRES):
    return "".join(random.choice(alphabet) for _ in range(n))

def palindrome(n, alphabet=LETTRES):
    moitie = mot_au_hasard(n // 2, alphabet)
    milieu = random.choice(alphabet) if n % 2 == 1 else ""
    return moitie + milieu + moitie[::-1]

def presque(n):
    # Un palindrome dont on change une seule lettre (pas celle du milieu).
    p = list(palindrome(n))
    i = random.randrange(n // 2)
    p[i] = "a" if p[i] != "a" else "b"
    return "".join(p)

def test(mots):
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

tests = [
    test(["piolet", "kayak", "marmotte"]),
    test(["a", "ressasser"]),
]
# Cas limites
tests.append(test(["z"]))
tests.append(test(["ab"]))
tests.append(test(["aa", "aba", "abba", "abca", "abcba"]))
tests.append(test(["neige", "radar", "sos", "elle", "refuge", "ete", "lac", "non"]))
tests.append(test([palindrome(50) for _ in range(5)]))
tests.append(test([presque(random.randint(2, 50)) for _ in range(20)]))
# Grands tests aléatoires (mélange de palindromes et de mots quelconques)
for _ in range(3):
    mots = []
    for _ in range(100):
        n = random.randint(1, 50)
        r = random.random()
        if r < 0.3:
            mots.append(palindrome(n, "abc"))
        elif r < 0.5:
            mots.append(presque(max(n, 2)))
        else:
            mots.append(mot_au_hasard(n, random.choice(["ab", LETTRES])))
    tests.append(test(mots))
print(json.dumps(tests))
