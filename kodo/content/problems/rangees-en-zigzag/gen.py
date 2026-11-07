import json, random
random.seed(2026)

tests = ["4 6\n", "4 11\n", "3 6\n"]
tests += [
    "1 1\n",                    # une seule place par rangée
    "1 1000000000\n",
    "5 1\n",                    # la toute première personne
    "5 5\n",                    # dernière place de la rangée 1
    "5 6\n",                    # première personne de la rangée 2 : place 5
    "5 10\n",                   # dernière personne de la rangée 2 : place 1
    "5 11\n",                   # première personne de la rangée 3 : place 1
    "1000000 1000000000\n",     # fin de la rangée 1000, qui va vers la gauche
    "1000000 999000001\n",      # début de la rangée 1000
    "1000000 999999999\n",
    "999999 1000000000\n",
    "2 1000000000\n",
]
for _ in range(5):
    m = random.randint(1, random.choice([10, 1000, 1000000]))
    tests.append(f"{m} {random.randint(1, 10**9)}\n")
print(json.dumps(tests))
