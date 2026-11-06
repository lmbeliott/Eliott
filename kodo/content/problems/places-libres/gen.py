import json, random
random.seed(2026)

tests = ["60\n45\n", "30\n30\n"]
tests += ["1\n0\n", "1\n1\n", "200\n0\n", "200\n200\n", "200\n1\n", "8\n3\n"]
for _ in range(4):
    c = random.randint(1, 200)
    p = random.randint(0, c)
    tests.append(f"{c}\n{p}\n")
print(json.dumps(tests))
