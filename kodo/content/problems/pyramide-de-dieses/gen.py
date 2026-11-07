import json

tests = ["4\n", "1\n"]
tests += [f"{n}\n" for n in [2, 3, 5, 10, 17, 32, 49, 50]]
print(json.dumps(tests))
