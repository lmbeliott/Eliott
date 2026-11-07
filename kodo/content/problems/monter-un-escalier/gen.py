import json

tests = ["4\n", "10\n"]
tests += [f"{n}\n" for n in [1, 2, 3, 5, 20, 37, 50, 69, 70]]
print(json.dumps(tests))
