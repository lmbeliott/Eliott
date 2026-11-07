import json, random
random.seed(2026)

def test(questions):
    return f"{len(questions)}\n" + "".join(f"{a} {n} {m}\n" for a, n, m in questions)

G = 10**18

def question_au_hasard():
    m = random.choice([random.randint(1, 10**9), 10**9, 999999937, 2**29, 720720 * 1000, random.randint(1, 100)])
    genre = random.randint(1, 6)
    if genre == 1:
        a = random.randint(0, 10) * m + 1       # A ≡ 1 (mod M) : diviser par A - 1 est impossible
    elif genre == 2:
        a = random.randint(0, 3)
    else:
        a = random.randint(0, G)
    n = random.choice([random.randint(0, G), G, random.randint(0, 10**6), random.randint(0, 60)])
    return (a, n, m)

tests = [
    test([(2, 3, 100), (3, 4, 7), (5, 0, 13)]),
    test([(1, 10, 1000), (4, 5, 6)]),
    test([(0, 0, 1), (0, G, 10**9), (1, G, 10**9)]),
    test([(7, G, 1)]),                                    # tout est divisible par 1
    test([(G, G, 999999937), (G - 1, G, 10**9), (999999937, 5, 999999937)]),
    test([(10**9 + 1, G, 10**9), (2, G, 2**29), (3, 63, 2**30)]),
    test([(random.randint(0, 50), random.randint(0, 200), random.randint(1, 1000)) for _ in range(20)]),
    test([question_au_hasard() for _ in range(100)]),
]
# tailles maximales
for _ in range(3):
    tests.append(test([question_au_hasard() for _ in range(1000)]))
print(json.dumps(tests))
