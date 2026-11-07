import json

tests = ["20\n", "9\n"]
tests += [f"{s}\n" for s in [0, 1, 8, 10, 18, 19, 27, 53, 100, 153, 161, 162]]
print(json.dumps(tests))
