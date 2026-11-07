import json, random
random.seed(2026)

tests = ["10 23\n", "10 20\n"]
tests += [
    "1 1\n",          # une seule place par rangée
    "1 1000000\n",
    "1000 1\n",       # la toute première place
    "1000 1000\n",    # dernière place de la première rangée
    "1000 1001\n",    # première place de la deuxième rangée
    "1000 1000000\n",
    "7 49\n",
    "7 50\n",
    "999 999999\n",
]
for _ in range(4):
    tests.append(f"{random.randint(1, 1000)} {random.randint(1, 1000000)}\n")
print(json.dumps(tests))
