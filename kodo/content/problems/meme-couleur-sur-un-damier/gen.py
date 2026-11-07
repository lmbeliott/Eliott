import json, random
random.seed(2026)

G = 10**9
tests = ["1 1\n3 5\n", "2 7\n4 4\n"]
tests += [
    "1 1\n1 1\n",                  # la même case
    "1 1\n1 2\n",                  # deux voisines sur une ligne
    "1 1\n2 1\n",                  # deux voisines sur une colonne
    "1 1\n2 2\n",                  # en diagonale : même couleur
    f"{G} {G}\n1 1\n",
    f"{G} {G - 1}\n1 1\n",
    f"{G} 1\n1 {G}\n",
    "5 8\n8 5\n",
    "6 6\n7 7\n",
    "3 4\n10 1\n",
]
for _ in range(4):
    tests.append(f"{random.randint(1, G)} {random.randint(1, G)}\n{random.randint(1, G)} {random.randint(1, G)}\n")
print(json.dumps(tests))
