import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"
VOYELLES = "aeiouy"
CONSONNES = "bcdfghjklmnpqrstvwxz"

def hasard(n, p):
    # Chaque lettre est une voyelle avec la probabilité p.
    return "".join(random.choice(VOYELLES) if random.random() < p else random.choice(CONSONNES)
                   for _ in range(n))

def alterne(n):
    # Voyelle, consonne, voyelle… : énormément de morceaux équilibrés.
    return "".join(random.choice(VOYELLES) if i % 2 == 0 else random.choice(CONSONNES) for i in range(n))

tests = ["banane\n", "programme\n", "bcdf\n"]
tests += [
    "a\n",                                      # une lettre : aucun morceau équilibré
    "ab\n",
    "yz\n",                                     # y est une voyelle
    "aaaaabbbbb\n",
    "aeiouybcdfgh\n",
    "bbbbbbbbbbbbbbbbbbba\n",
    "".join(random.choice(LETTRES) for _ in range(50)) + "\n",
    hasard(1000, 0.3) + "\n",
    hasard(30000, 0.5) + "\n",
    "b" * 30000 + "a" * 10000 + "\n",           # le seul long morceau est au milieu
    hasard(100000, 0.5) + "\n",
    alterne(100000) + "\n",                     # le nombre de morceaux dépasse 2³¹
    hasard(60000, 0.45) + "\n",
    "a" * 10000 + "\n",                         # aucune consonne
]
print(json.dumps(tests))
