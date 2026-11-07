import json, random
random.seed(2026)


def mot(l, p_chiffre):
    res = []
    groupe = 0
    for _ in range(l):
        if random.random() < p_chiffre and groupe < 9:
            res.append(random.choice("0123456789"))
            groupe += 1
        else:
            res.append(random.choice("abcdefghijklmnopqrstuvwxyz"))
            groupe = 0
    return "".join(res)


tests = ["ab12c3d045\n", "x7y8z9\n"]
tests.append("a\n")
tests.append("5\n")
tests.append("000\n")
tests.append("abc\n")
tests.append("999999999\n")
tests.append("1a2b3c4d5e6f7g8h9i10\n")
tests.append("".join("999999999a" for _ in range(9000)) + "\n")   # grand total
tests.append(mot(100000, 0.5) + "\n")
tests.append(mot(100000, 0.95) + "\n")
tests.append(mot(1000, 0.1) + "\n")
tests.append("007bond0\n")
print(json.dumps(tests))
