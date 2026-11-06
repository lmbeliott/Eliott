import json, random
random.seed(2026)

def test(k, chiffres):
    return f"{len(chiffres)} {k}\n{chiffres}\n"

def aleatoire(n, alphabet="123456789"):
    return "".join(random.choice(alphabet) for _ in range(n))

tests = [
    test(3, "4731592"),
    test(2, "123456"),
    test(0, "7"),
    test(1, "52"),
    test(4, "99999"),                 # tout identique
    test(3, "987654321"),             # décroissant : on efface le début
    test(2, "1223333"),               # croissant : on efface la fin
    test(5, "3141592653589793"),
    test(6, aleatoire(20)),
]
tests.append(test(1500, aleatoire(3000)))
tests.append(test(10, aleatoire(20000, "56789")))
# tailles maximales : longues montées puis chute, pire cas pour la solution naïve
tests.append(test(30000, "1" * 40000 + "2" * 30000 + "9" * 29999 + "1"))
tests.append(test(50000, "".join(sorted(aleatoire(70000))) + aleatoire(30000, "12")))
tests.append(test(40000, aleatoire(100000)))
print(json.dumps(tests))
