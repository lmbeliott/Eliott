import json, random
random.seed(2026)

def mot(n, lettres):
    return "".join(random.choice(lettres) for _ in range(n))

tests = ["dcba\n", "abcab\n"]
tests.append("z\n")
tests.append("ba\n")
tests.append("aaaaaaaaaa\n")
tests.append("zyxwvutsrqponmlkjihgfedcba\n")
tests.append(mot(37, "ab") + "\n")
tests.append(mot(1000, "abc") + "\n")
tests.append(mot(100000, "ab") + "\n")
tests.append(mot(100000, "abcdefghijklmnopqrstuvwxyz") + "\n")
tests.append("".join(chr(122 - (i % 26)) for i in range(65536)) + "\n")
tests.append("b" * 5000 + "a" * 4999 + "\n")
print(json.dumps(tests))
