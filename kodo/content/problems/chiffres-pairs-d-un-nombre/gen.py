import json, random
random.seed(2026)

tests = ["2026\n", "13579\n"]
tests += [
    "0\n",            # un seul chiffre, et il est pair
    "7\n",
    "8\n",
    "10\n",
    "305\n",
    "1000000000\n",   # neuf zéros
    "999999999\n",
    "246802468\n",
    "123456789\n",
]
for _ in range(5):
    tests.append(f"{random.randint(0, 10**random.randint(1, 9))}\n")
print(json.dumps(tests))
