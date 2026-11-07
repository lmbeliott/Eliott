import json, random
random.seed(2044)
tests = [24, 360, 2, 97, 4, 64, 30030, 2 ** 26, 3 ** 16, 99999989, 100000000, 86486400, 73513440, 36756720, 9699690, 61261200, 98000000]
tests += [random.randint(2, 10 ** 8) for _ in range(3)]
print(json.dumps([f"{t}\n" for t in tests]))
