import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)}\n" + "\n".join(lignes) + "\n"

def libre(n):
    return ["." * n for _ in range(n)]

def obstacles(n, proba):
    return ["".join("#" if random.random() < proba else "." for _ in range(n)) for _ in range(n)]

tests = [
    test(libre(4)),
    test(["..#..", ".....", "....#", ".....", "#...."]),
    test(["."]),
    test(["#"]),
    test(libre(2)),
    test(libre(3)),
    test(["..#.", "....", "#...", "...."]),     # les deux solutions sont bloquées
    test(["#....", ".....", ".....", ".....", "....."]),
    test(libre(8)),
]
tests.append(test(obstacles(7, 0.2)))
tests.append(test(obstacles(9, 0.1)))
r = libre(10)
r[4] = "##########"                       # une ligne entièrement bloquée : aucune solution
tests.append(test(r))
# tailles maximales
tests.append(test(libre(11)))
tests.append(test(obstacles(11, 0.1)))
tests.append(test(obstacles(11, 0.25)))
print(json.dumps(tests))
