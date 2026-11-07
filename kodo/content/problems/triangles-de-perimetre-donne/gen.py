import json

tests = ["12\n", "9\n"]
tests += [f"{p}\n" for p in [1, 2, 3, 4, 5, 6, 100, 1001, 2999, 3000]]
print(json.dumps(tests))
