import json, random
random.seed(2026)

tests = ["300\n", "10000\n"]
tests += ["1\n", "219\n", "283\n", "284\n", "1210\n", "6368\n", "14594\n", "14595\n", "70000\n", "88729\n", "100000\n"]
tests.append(f"{random.randint(20000, 60000)}\n")
print(json.dumps(tests))
