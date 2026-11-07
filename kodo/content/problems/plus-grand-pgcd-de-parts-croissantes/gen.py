import json, random
random.seed(4301)
tests = ["24 3\n", "10 4\n", "1 1\n", "7 1\n", "6 3\n"]
tests += ["999999999989 1\n", "999999999989 2\n"]          # N premier
tests += ["1000000000000 1000000\n", "1000000000000 1414213\n"]
tests += ["1000000000000 1000000000\n"]                    # K (K + 1) / 2 dépasse N : -1
tests += ["963761198400 1000\n", "999999000001 1\n", "549755813888 30\n", "999966000289 3\n"]
tests += [f"{random.randint(1, 10 ** 12)} {random.randint(1, 2000)}\n" for _ in range(3)]
print(json.dumps(tests))
