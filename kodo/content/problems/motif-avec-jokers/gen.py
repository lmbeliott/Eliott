import json, random
random.seed(2026)

def alea(n, alpha):
    return "".join(random.choice(alpha) for _ in range(n))

def test(t, p):
    return f"{t}\n{p}\n"

tests = [test("abracadabra", "a?a"), test("chocolat", "?o")]
tests.append(test("abc", "abcd"))                  # motif plus long que le texte
tests.append(test("abc", "???"))
tests.append(test("aaaaa", "aa"))                 # chevauchements
tests.append(test("xyz", "q"))
tests.append(test("z", "?"))
tests.append(test(alea(40, "ab"), "a?b"))
tests.append(test(alea(300, "abc"), "?b?c"))
# grands tests : pire cas de la recherche naïve
tests.append(test("a" * 50000, "aaaaaaaaa?"))
tests.append(test("a" * 49999 + "b", "aaaaaaaaab"))
tests.append(test(alea(50000, "ab"), "ab??ba?a"))
tests.append(test(alea(50000, "abcdefghijklmnopqrstuvwxyz"), "e?"))
print(json.dumps(tests))
