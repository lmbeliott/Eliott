import json, random
random.seed(2026)

def chiffrer(cle, message):
    res = []
    k = 0
    for c in message:
        if c == " ":
            res.append(" ")
        else:
            d = ord(cle[k % len(cle)]) - ord("a")
            res.append(chr((ord(c) - ord("a") + d) % 26 + ord("a")))
            k += 1
    return "".join(res)

def test(cle, clair):
    return f"{cle}\n{chiffrer(cle, clair)}\n"

def phrase(nb_mots):
    return " ".join("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(random.randint(1, 9)))
                    for _ in range(nb_mots))

tests = [test("bac", "un message secret"), test("z", "le zebra")]
tests.append(test("a", "rien ne change"))                 # clé neutre
tests.append(test("b", "z"))                               # passage de z à a
tests.append(test("zzz", "abc"))
tests.append(test("cle", "x y z a b c"))                   # les espaces ne consomment pas la clé
tests.append(test("abcdefghijklmnopqrstuvwxyz", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
tests.append(test("longuecle", "court"))                   # clé plus longue que le message
for lk, nm in [(5, 20), (37, 150), (100, 180)]:
    cle = "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(lk))
    tests.append(test(cle, phrase(nm)[:1000]))
print(json.dumps(tests))
