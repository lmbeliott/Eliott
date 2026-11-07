import json, random
random.seed(2026)

G = 10**9
tests = ["3 7 10 40\n", "2 10 13 21\n"]
tests += [
    "1 1 1 1\n",              # un marché chaque jour, un seul jour
    "5 3 5 5\n",              # A = B = S : le premier marché
    "5 3 6 7\n",              # entre deux marchés : 0
    "4 6 4 100\n",            # A = S
    "4 6 10 16\n",            # A et B sont des jours de marché
    "1 1 1 1000000000\n",     # tous les jours
    "1 1000000000 1 1000000000\n",
    "1000000000 1000000000 1000000000 1000000000\n",
    "999999999 1000000000 1000000000 1000000000\n",
    "1 2 2 1000000000\n",
    "17 1 500 600\n",
]
for _ in range(5):
    s = random.randint(1, G // 2)
    k = random.randint(1, random.choice([10, 1000, G]))
    a = random.randint(s, G)
    b = random.randint(a, G)
    tests.append(f"{s} {k} {a} {b}\n")
print(json.dumps(tests))
