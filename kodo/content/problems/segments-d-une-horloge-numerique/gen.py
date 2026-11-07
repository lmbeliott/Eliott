import json, random
random.seed(2026)

def h(t):
    return f"{t // 60:02d}:{t % 60:02d}"

def test(paires):
    return f"{len(paires)}\n" + "".join(f"{a} {b}\n" for a, b in paires)

def hasard(q):
    return test([(h(random.randint(0, 1439)), h(random.randint(0, 1439))) for _ in range(q)])

tests = [
    test([("09:59", "10:01"), ("12:34", "12:34")]),
    test([("23:59", "00:00"), ("07:00", "07:05")]),
]
tests += [
    test([("00:00", "00:01")]),
    test([("00:00", "23:59")]),                     # presque un tour complet
    test([("00:01", "00:00"), ("13:37", "13:36")]), # un tour moins une minute
    test([("05:05", "05:05"), ("23:59", "23:59")]),  # rien ne bouge
    test([("19:59", "20:00"), ("09:59", "10:00"), ("11:59", "12:00"), ("12:59", "13:00")]),
    test([("22:00", "02:00"), ("18:45", "06:15"), ("23:30", "00:30")]),  # passage par minuit
    test([(h(t), h(t + 1)) for t in range(0, 1439, 73)][:20]),
    hasard(20),
    hasard(20),
    test([(h(random.randint(0, 1439)), "00:00") for _ in range(10)] + [("00:00", h(random.randint(0, 1439))) for _ in range(10)]),
]
print(json.dumps(tests))
