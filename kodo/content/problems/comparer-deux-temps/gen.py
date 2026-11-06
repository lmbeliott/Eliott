import json, random
random.seed(2026)

tests = ["47 52\n", "61 58\n", "50 50\n"]
tests += ["1 600\n", "600 1\n", "600 600\n", "1 1\n", "100 101\n", "101 100\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 600)} {random.randint(1, 600)}\n")
x = random.randint(1, 600)
tests.append(f"{x} {x}\n")
print(json.dumps(tests))
