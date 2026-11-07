import json, random
random.seed(2026)

G = 10**9
tests = ["3 25 2\n", "5 9 3\n", "2 100 3\n"]
tests += [
    "1 1 2\n",                  # déjà arrivé
    "7 7 10\n",
    "1 2 2\n",
    "1 1000000000 10\n",        # que des multiplications par 10
    "1 999999999 10\n",
    "1 536870912 2\n",          # 2 puissance 29
    "1 536870911 2\n",
    "1 1000000000 2\n",
    "500000000 1000000000 2\n", # une seule multiplication
    "500000001 1000000000 2\n", # aucune multiplication possible
    "1000000000 1000000000 7\n",
    "3 999999998 3\n",
    "40 999999999 9\n",
]
for _ in range(5):
    a = random.randint(1, random.choice([10, 1000, 100000]))
    b = random.randint(a, G)
    tests.append(f"{a} {b} {random.randint(2, 10)}\n")
print(json.dumps(tests))
