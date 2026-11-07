import json, random
random.seed(3102)
LETTRES = "abcdefghijklmnopqrstuvwxyz"

def mot(lo, hi):
    return "".join(random.choice(LETTRES) for _ in range(random.randint(lo, hi)))

def test(mots):
    return f"{len(mots)}\n{' '.join(mots)}\n"

tests = [test(["pomme", "kiwi", "fraise", "noix"]),
         test(["le", "chat", "a", "vu", "un", "rat", "noir", "et", "gris"])]
tests.append(test(["abc"]))                                       # un seul mot
tests.append(test(["aaa", "bb", "c", "dd", "eee", "f"]))
tests.append(test(["zz", "yy", "xx", "ww", "vv"]))                # même longueur : ordre conservé
tests.append(test(["abcdefghijkl", "a", "abcdefghijkl", "b"]))
tests.append(test([mot(1, 12) for _ in range(60)]))
tests.append(test([mot(3, 5) for _ in range(2000)]))
# grands tests : un tri par insertion serait trop lent
tests.append(test([mot(1, 8) for _ in range(20000)]))
tests.append(test([mot(1, 3) if i % 2 else mot(6, 7) for i in range(20000)]))
print(json.dumps(tests))
