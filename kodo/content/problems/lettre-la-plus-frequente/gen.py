import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
AUTRES = " .,;:!?'-()"


def texte(l, lettres=LETTRES):
    s = "".join(random.choice(lettres) if random.random() < 0.8 else random.choice(AUTRES) for _ in range(l))
    return s if any(c.isalpha() for c in s) else s + "a"


tests = ["Le chat de la voisine a mange LA souris !\n", "Bb, aA ; c.\n"]
tests.append("z\n")
tests.append("Q\n")
tests.append("... ! ? M ...\n")
tests.append("abcdefghijklmnopqrstuvwxyz ZYXWVUTSRQPONMLKJIHGFEDCBA\n")   # égalité générale
tests.append("Hello, World!\n")
tests.append(texte(10000) + "\n")
tests.append(texte(10000, "xyzXYZ") + "\n")
tests.append(texte(5000, "eE") + "\n")
tests.append(texte(200) + "\n")
tests.append("zzz yyy XXX\n")
print(json.dumps(tests))
