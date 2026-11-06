import json, random
random.seed(2026)

tests = ["300 100 700\n", "400 300 1000\n"]
tests += [
    "500 200 400\n",     # en haut dès le premier jour
    "100 50 100\n",      # exactement A
    "100 50 101\n",      # un de plus : il faut un deuxième jour
    "1 0 1\n",
    "1 0 50000\n",
    "2 1 50000\n",
    "1000 999 50000\n",
    "1000 0 50000\n",
    "7 3 50000\n",
]
for _ in range(4):
    a = random.randint(2, 1000)
    b = random.randint(0, a - 1)
    h = random.randint(1, 50000)
    tests.append(f"{a} {b} {h}\n")
print(json.dumps(tests))
