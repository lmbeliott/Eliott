import json, random
random.seed(2026)


def fmt(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"


tests = [
    fmt([5, 2, 3, 6]),
    fmt([1, 1, 1, 2, 1]),
]
tests.append(fmt([42]))
tests.append(fmt([10, 3]))
tests.append(fmt([7] * 8))                               # 8 nombres égaux : coût nul
tests.append(fmt([7] * 7))
tests.append(fmt([1, 2, 4, 8, 16, 32, 64, 128]))
tests.append(fmt([random.randint(1, 20) for _ in range(12)]))
tests.append(fmt([random.randint(1, 10 ** 9) for _ in range(40)]))
tests.append(fmt([random.randint(1, 10 ** 9) for _ in range(250)]))
tests.append(fmt([random.randint(1, 3) for _ in range(250)]))
tests.append(fmt([10 ** 9] * 250))
tests.append(fmt(sorted(random.randint(1, 10 ** 9) for _ in range(250))))
# Des nombres énormes et minuscules en alternance, puis en blocs.
tests.append(fmt([10 ** 9 if i % 2 == 0 else random.randint(1, 100) for i in range(249)]))
tests.append(fmt([random.choice([1, 10 ** 9 - random.randint(0, 5)]) for _ in range(250)]))
tests.append(fmt([1] * 120 + [10 ** 9] + [1] * 129))
print(json.dumps(tests))
