import json

tests = ["5\n", "8\n"]
tests += [f"{n}\n" for n in [1, 2, 3, 4, 7, 13, 20, 49, 50]]
print(json.dumps(tests))
