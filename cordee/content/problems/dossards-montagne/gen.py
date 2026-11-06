import json, random
random.seed(2026)

tests = ["100 140\n", "1 99\n"]
# Cas limites : un seul nombre (montagne ou non), paliers, remontées.
tests += ["132 132\n", "123 123\n", "1221 1221\n", "13531 13531\n", "13513 13513\n", "12321 12321\n", "1 1\n"]
tests += ["1 1000\n", "980 1000\n", "1 100000\n", "100000 100000\n"]
# Intervalles aléatoires.
for _ in range(3):
    a = random.randint(1, 100000)
    b = random.randint(a, 100000)
    tests.append(f"{a} {b}\n")
tests.append("12000 13999\n")
print(json.dumps(tests))
