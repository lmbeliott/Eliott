import json, random
random.seed(2026)

def test(mot):
    return f"{len(mot)}\n{mot}\n"

def alea(n, alpha):
    return "".join(random.choice(alpha) for _ in range(n))

tests = [test("abca"), test("aaa")]
tests.append(test("z"))
tests.append(test("abcdefghijklmnopqrstuvwxyz"))   # aucune
tests.append(test("abab"))
tests.append(test(alea(30, "ab")))
tests.append(test(alea(500, "abcdefghijklmnopqrstuvwxyz")))
# grands tests : essayer tous les couples serait trop lent
tests.append(test("a" * 100000))                   # 100000 × 199999 / 2
tests.append(test(alea(100000, "abcdefghijklmnopqrstuvwxyz")))
tests.append(test(alea(100000, "xy")))
print(json.dumps(tests))
