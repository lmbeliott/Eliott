import json, random
random.seed(2026)

def test(nums):
    return f"{len(nums)}\n" + "".join(f"{x}\n" for x in nums)

tests = [test([39, 999, 4]), test([25, 10, 77])]
tests.append(test([0]))
tests.append(test([10**18, 10**18 - 1, 9, 11]))
tests.append(test([277777788888899, 3778888999, 438939, 4996, 679, 68889, 2677889, 26888999]))
tests.append(test([random.randint(0, 99) for _ in range(100)]))
tests.append(test([random.randint(0, 10**6) for _ in range(1000)]))
# nombres sans zéro : persistances plus grandes
tests.append(test([int("".join(random.choice("6789") for _ in range(random.randint(2, 18)))) for _ in range(1000)]))
tests.append(test([random.randint(0, 10**18) for _ in range(1000)]))
tests.append(test([int("".join(random.choice("23456789") for _ in range(random.randint(1, 18)))) for _ in range(1000)]))
print(json.dumps(tests))
