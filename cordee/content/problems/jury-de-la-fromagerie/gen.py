import json, random
random.seed(2026)

tests = ["12 17 9\n", "15 8 15\n"]
tests += ["7 7 7\n", "5 5 1\n", "1 5 5\n", "20 20 0\n", "0 0 20\n"]
# Les six ordres possibles de trois notes différentes.
for a, b, c in [(3, 10, 18), (3, 18, 10), (10, 3, 18), (10, 18, 3), (18, 3, 10), (18, 10, 3)]:
    tests.append(f"{a} {b} {c}\n")
for _ in range(4):
    tests.append(f"{random.randint(0, 20)} {random.randint(0, 20)} {random.randint(0, 20)}\n")
print(json.dumps(tests))
