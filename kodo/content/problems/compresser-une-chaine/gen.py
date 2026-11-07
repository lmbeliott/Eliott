import json, random
random.seed(2026)

def groupes(nb, lettres, long_max):
    # Une chaîne faite de groupes de lettres, deux groupes voisins étant différents.
    s, avant = "", ""
    for _ in range(nb):
        c = random.choice([x for x in lettres if x != avant])
        s += c * random.randint(1, long_max)
        avant = c
    return s[:1000]

tests = ["aaabcc\n", "xyyyyyyyyyyyx\n"]
tests += [
    "a\n",
    "ab\n",
    "zz\n",
    "aaaaaaaaa\n",        # 9 : un seul chiffre
    "aaaaaaaaaa\n",       # 10 : deux chiffres
    "abcdefghijklmnopqrstuvwxyz\n",
    "m" * 1000 + "\n",
    ("ab" * 500) + "\n",
    "q" * 999 + "r\n",
    "mississippi\n",
]
for (nb, lettres, long_max) in [(30, "ab", 5), (80, "xyz", 20), (300, "abcdefghij", 3), (40, "pq", 60)]:
    tests.append(groupes(nb, lettres, long_max) + "\n")
print(json.dumps(tests))
