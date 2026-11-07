import json, random
random.seed(2026)

DIVISEURS = [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500, 1000]

def alea(n, chiffres="0123456789"):
    return "".join(random.choice(chiffres) for _ in range(n))

def test(k, d):
    return f"{k}\n{d}\n"

tests = [test(25, "1250"), test(8, "1024")]
tests.append(test(1, "7"))
tests.append(test(1000, "0"))
tests.append(test(1000, "123"))
tests.append(test(2, "13579"))                      # aucun
tests.append(test(125, "000"))
tests.append(test(4, alea(30)))
for k in [5, 40, 200, 500]:
    tests.append(test(k, alea(random.randint(50, 300), "0123456789" if k != 500 else "05")))
# grands tests : examiner chacun des ~10¹⁰ morceaux serait trop lent
tests.append(test(1, alea(150000)))
tests.append(test(8, alea(150000, "02468")))
tests.append(test(125, alea(80000, "0125")))
print(json.dumps(tests))
