import json, random
random.seed(2026)

tests = ["1 20\n", "6 30\n"]
tests += [
    "1 1\n",
    "1 4\n",            # 1 n'est pas premier
    "3 5\n",            # une seule paire, pile aux bornes
    "3 4\n",
    "5 7\n",
    "4 6\n",
    "20000 20000\n",
    "1 20000\n",
    "19000 20000\n",
    "10000 20000\n",
    "24 28\n",          # aucun nombre premier
]
for _ in range(4):
    a = random.randint(1, 20000)
    tests.append(f"{a} {random.randint(a, 20000)}\n")
print(json.dumps(tests))
