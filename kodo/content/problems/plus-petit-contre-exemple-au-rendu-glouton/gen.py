import json, random
random.seed(2026)

def test(c):
    return f"{len(c)}\n{' '.join(map(str, c))}\n"

def systeme(k, maxv):
    return [1] + sorted(random.sample(range(2, maxv + 1), k - 1))

tests = [test([1, 3, 4]), test([1, 2, 5, 10, 20, 50, 100, 200, 500])]
tests.append(test([1]))
tests.append(test([1, 30000]))
tests.append(test([1, 5, 12]))
tests.append(test([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384]))
tests.append(test([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000]))
tests.append(test([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]))
tests.append(test([1, 10000, 10001, 29999, 30000]))
tests.append(test(systeme(15, 30000)))
tests.append(test(systeme(4, 30000)))
tests.append(test([1, 14999, 15000, 29998, 29999]))
tests.append(test([1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683, 29999]))
print(json.dumps(tests))
