import json, random
random.seed(2026)

def chiffrer(message, k):
    """Écriture en zigzag, par simple simulation (sert à fabriquer les tests)."""
    lignes = [[] for _ in range(k)]
    r, pas = 0, 1
    for c in message:
        lignes[r].append(c)
        if k > 1:
            if r == 0:
                pas = 1
            elif r == k - 1:
                pas = -1
            r += pas
    return "".join("".join(l) for l in lignes)

def test(message, k):
    return f"{k}\n{chiffrer(message, min(k, len(message)))}\n"

def alea(n):
    return "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(n))

tests = [test("programmation", 3), test("zigzag", 2)]
tests.append(test("a", 1))
tests.append(test("a", 10**9))
tests.append(test("message", 1))
tests.append(test("message", 7))                  # K = N : une lettre par ligne
tests.append(test("message", 1000))               # K > N
tests.append(test("abcdefghij", 4))
tests.append(test(alea(200), 13))
# grands tests : une grille de K lignes sur N colonnes serait bien trop grande
tests.append(test(alea(150000), 150000))
tests.append(test(alea(150000), 75001))
tests.append(test(alea(40000), 3))
tests.append(test(alea(40000), 10**9))
print(json.dumps(tests))
