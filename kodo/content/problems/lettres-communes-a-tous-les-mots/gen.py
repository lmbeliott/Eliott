import json, random
random.seed(2026)

def test(mots):
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def mot(lettres, longueur):
    return "".join(random.choice(lettres) for _ in range(longueur))

tests = [test(["tartine", "patate", "attention"]), test(["ciel", "mer", "sol"])]
tests.append(test(["bonjour"]))                                  # un seul mot : ses lettres
tests.append(test(["abc", "abc", "abc"]))
tests.append(test(["zzzz", "z"]))
tests.append(test(["abcdefghijklmnopqrstuvwxyz", "zyxwvutsrqponmlkjihgfedcba"]))
tests.append(test(["a", "b"]))
for n, lettres, lmin, lmax in [(10, "aeioulmnrst", 12, 30), (100, "abcdefghijkl", 25, 60),
                               (1000, "abcdefghijklmnopqrstuvwxyz", 60, 100), (1000, "bcdfgkw", 30, 100)]:
    tests.append(test([mot(lettres, random.randint(lmin, lmax)) for _ in range(n)]))
# grand test : chaque mot contient e, q et x, plus des lettres au hasard
mots = []
for _ in range(1000):
    m = list(mot("abcdefghijklmnoprstuvw", random.randint(10, 97)) + "eqx")
    random.shuffle(m)
    mots.append("".join(m))
tests.append(test(mots))
print(json.dumps(tests))
