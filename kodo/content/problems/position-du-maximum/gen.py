import json, random
random.seed(2026)

def test(scores):
    return f"{len(scores)}\n" + " ".join(map(str, scores)) + "\n"

tests = [test([98, 112, 105, 120, 87]), test([101, 115, 115, 99])]
tests.append(test([87]))
tests.append(test([100, 100, 100, 100]))
tests.append(test([250, 120, 130, 250]))      # égalité entre le premier et le dernier
tests.append(test([90, 95, 100, 105, 110]))   # le meilleur est le dernier
tests.append(test([140, 130, 120, 110]))      # le meilleur est le premier
tests.append(test([1, 1, 2, 1, 2, 2]))
grand = [random.randint(1, 249) for _ in range(1000)]
grand[617] = 250
grand[842] = 250
tests.append(test(grand))
tests.append(test([random.randint(80, 140) for _ in range(1000)]))
for _ in range(3):
    n = random.randint(5, 30)
    tests.append(test([random.randint(80, 140) for _ in range(n)]))
print(json.dumps(tests))
