import json, random
random.seed(2026)

def d(j, m, a):
    return f"{j} {m} {a}\n"

tests = [d(14, 7, 2021) + d(3, 2, 2022), d(30, 1, 2020) + d(2, 3, 2019), d(5, 6, 2000) + d(5, 6, 2000)]
tests.append(d(1, 3, 2024) + d(29, 2, 2024))
tests.append(d(10, 5, 1999) + d(9, 5, 1999))
tests.append(d(9, 5, 1999) + d(10, 5, 1999))
tests.append(d(31, 12, 9999) + d(1, 1, 1))
tests.append(d(1, 1, 1) + d(1, 1, 2))
tests.append(d(1, 12, 500) + d(31, 11, 500))
tests.append(d(31, 1, 2000) + d(1, 2, 2000))
for _ in range(3):
    tests.append(d(random.randint(1, 28), random.randint(1, 12), random.randint(1, 9999)) +
                 d(random.randint(1, 28), random.randint(1, 12), random.randint(1, 9999)))
a = random.randint(1, 9999)
tests.append(d(random.randint(1, 28), random.randint(1, 12), a) + d(random.randint(1, 28), random.randint(1, 12), a))
print(json.dumps(tests))
