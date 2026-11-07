import json, random
random.seed(2026)

def alea(n, alpha):
    return "".join(random.choice(alpha) for _ in range(n))

def test(s, k):
    return f"{len(s)} {k}\n{s}\n"

tests = [test("abababa", 3), test("banane", 2)]
tests.append(test("x", 1))
tests.append(test("zyx", 3))                      # une seule sous-chaîne
tests.append(test("dcba", 1))                     # égalité : la plus petite
tests.append(test("aaaa", 2))                     # chevauchements : 3
tests.append(test(alea(60, "ab"), 4))
tests.append(test(alea(1000, "abc"), 5))
# grands tests : recompter chaque sous-chaîne serait trop lent
tests.append(test("a" * 100000, 10))
tests.append(test(alea(100000, "ab"), 10))
tests.append(test(alea(100000, "abcdefghijklmnopqrstuvwxyz"), 3))
tests.append(test(("abcdefghij" * 9000)[3:] + "abc", 7))
print(json.dumps(tests))
