import json, random
random.seed(2026)

tests = ["6\n", "10\n", "3\n"]
tests += [
    "1\n",            # une seule façon
    "2\n",
    "4\n",
    "5\n",            # première pièce de 5
    "9\n",
    "1000000\n",      # le plus grand N
    "999999\n",
    "999995\n",
    "65536\n",
    "300000\n",
    "500001\n",
]
for _ in range(4):
    tests.append(f"{random.randint(1, 1000000)}\n")
tests.append(f"{random.randint(11, 100)}\n")
print(json.dumps(tests))
