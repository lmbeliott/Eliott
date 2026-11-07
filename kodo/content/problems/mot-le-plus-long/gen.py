import json, random
random.seed(2026)


def mot(l):
    return "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(l))


def test(mots):
    return f"{len(mots)}\n" + " ".join(mots) + "\n"


tests = [test(["le", "chat", "mange", "une", "souris"]), test(["zoo", "abricot", "ananas", "bonjour"])]
tests.append(test(["a"]))
tests.append(test(["ab", "cd", "ef"]))                     # égalité : le premier
tests.append(test(["x", "yy", "zzz"]))                     # le dernier
tests.append(test([mot(100)] + [mot(100) for _ in range(5)]))
tests.append(test([mot(random.randint(1, 10)) for _ in range(1000)]))
tests.append(test([mot(random.randint(1, 100)) for _ in range(1000)]))
tests.append(test([mot(3) for _ in range(500)]))
tests.append(test([mot(5) for _ in range(20)] + [mot(6)] + [mot(6) for _ in range(5)]))
print(json.dumps(tests))
