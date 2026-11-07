import json, random
random.seed(2026)

tests = ["bonjour\n3\n", "a\n1\n"]
tests += ["kodo\n100\n", "abcdefghijklmnopqrst\n2\n", "zzz\n10\n"]
letters = "abcdefghijklmnopqrstuvwxyz"
for _ in range(5):
    w = "".join(random.choice(letters) for _ in range(random.randint(1, 20)))
    tests.append(f"{w}\n{random.randint(1, 100)}\n")
print(json.dumps(tests))
