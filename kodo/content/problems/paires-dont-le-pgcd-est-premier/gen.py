import json, random
random.seed(2026)

def test(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"

V = 100000
N = 20000

def lisse():
    # un nombre qui n'a que des petits facteurs premiers : beaucoup de PGCD composés
    x = 1
    while True:
        p = random.choice([2, 2, 2, 3, 3, 5, 7, 11, 13])
        if x * p > V:
            return x
        x *= p
        if random.random() < 0.15:
            return x

tests = [
    test([4, 6, 8, 12, 7]),
    test([7, 7, 1, 14]),
    test([1]),
    test([99991]),                          # un seul nombre : aucune paire
    test([1] * 50),
    test([13] * 40),                        # PGCD 13 pour chaque paire
    test([V] * 30),                         # PGCD 100 000 : pas premier
    test([2 * random.randint(1, V // 2) for _ in range(60)]),
    test([random.randint(1, 100) for _ in range(200)]),
]
# tailles maximales
tests.append(test([random.randint(1, V) for _ in range(N)]))
tests.append(test([lisse() for _ in range(N)]))
tests.append(test([random.randint(1, 300) for _ in range(N)]))
a = [random.choice([2, 3, 5, 7]) * random.randint(1, V // 7) for _ in range(12000)] + [V, 99991]
random.shuffle(a)
tests.append(test(a))
print(json.dumps(tests))
