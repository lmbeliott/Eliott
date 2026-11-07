import json, random
random.seed(2026)

M = 10000
tests = ["250 130 50\n", "30 30 20\n"]
tests += [
    "1 1 1\n",              # une seule dalle, rien de jeté
    "200 100 50\n",         # tout tombe juste
    "7 5 10\n",             # une dalle plus grande que le sol
    "51 50 50\n",           # un centimètre de trop sur la longueur
    "49 101 50\n",
    "10000 10000 1\n",      # cent millions de dalles
    "10000 10000 10000\n",
    "10000 10000 9999\n",   # la plus grande surface jetée
    "1 10000 10000\n",
    "9999 9999 5000\n",
    "10000 1 3\n",
]
for _ in range(5):
    c = random.randint(1, random.choice([10, 100, M]))
    tests.append(f"{random.randint(1, M)} {random.randint(1, M)} {c}\n")
print(json.dumps(tests))
