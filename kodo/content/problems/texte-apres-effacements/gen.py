import json, random
random.seed(3201)

def frappes(n, p_eff, lettres="abcdefghijklmnopqrstuvwxyz"):
    return "".join("<" if random.random() < p_eff else random.choice(lettres) for _ in range(n))

tests = ["chaz<t\n", "ab<<<cd<e\n"]
tests.append("<\n")                               # effacer un texte vide
tests.append("abc<<<\n")                          # tout est effacé
tests.append("x\n")
tests.append("<<<kodo\n")
tests.append(frappes(50, 0.3) + "\n")
tests.append(frappes(2000, 0.5, "ab") + "\n")
# grands tests
tests.append(frappes(100000, 0.45) + "\n")
tests.append("a" * 50000 + "<" * 49999 + "\n")     # un texte long presque entièrement effacé
tests.append(frappes(100000, 0.1) + "\n")
print(json.dumps(tests))
