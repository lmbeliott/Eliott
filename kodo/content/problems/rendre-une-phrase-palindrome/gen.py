import json, random
random.seed(2026)

AUTRES = ".,;:!?'()-"

def habiller(lettres):
    """Ajoute majuscules, espaces, chiffres et ponctuation autour des lettres."""
    car = []
    for c in lettres:
        if random.random() < 0.3:
            c = c.upper()
        car.append(c)
        x = random.random()
        if x < 0.1:
            car.append(" ")
        elif x < 0.13:
            car.append(random.choice(AUTRES))
        elif x < 0.15:
            car.append(str(random.randint(0, 9)))
    s = "".join(car).strip()
    while "  " in s:
        s = s.replace("  ", " ")
    return s

def palindrome(n, alpha):
    moitie = [random.choice(alpha) for _ in range(n // 2)]
    milieu = [random.choice(alpha)] if n % 2 else []
    return moitie + milieu + moitie[::-1]

def abimer(t, k, alpha):
    t = list(t)
    for _ in range(k):
        i = random.randrange(len(t))
        t[i] = random.choice(alpha)
    return t

tests = ["Esope reste ici et se repose.", "Le chat dort.", "Ab, ba!"]
tests.append("x")
tests.append("2026 ... ?!")                      # aucune lettre
tests.append("aB")
tests.append("Zz")
tests.append("abcdef")
tests.append(habiller(abimer(palindrome(40, "abc"), 3, "abc")))
tests.append(habiller([random.choice("ab") for _ in range(50)]))
# grands tests
tests.append(habiller(palindrome(100000, "abcdefghijklmnopqrstuvwxyz")))
tests.append(habiller(abimer(palindrome(100000, "ab"), 3000, "ab")))
tests.append(habiller([random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(90000)]))
print(json.dumps(tests))
