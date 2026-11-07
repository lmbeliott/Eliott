import json, random
random.seed(2026)

def test(clients):
    return f"{len(clients)}\n" + "".join(f"{t} {d}\n" for t, d in clients)

def random_clients(n, tmax, dmax):
    ts = sorted(random.randint(0, tmax) for _ in range(n))
    return [(t, random.randint(1, dmax)) for t in ts]

tests = [test([(0, 5), (2, 3), (20, 4)]), test([(10, 1), (10, 1), (10, 1), (11, 2)])]
tests.append(test([(0, 1)]))
tests.append(test([(1000000, 1000)]))
tests.append(test([(0, 1000)] * 1000))                    # tout le monde arrive en même temps
tests.append(test([(5 * i, 5) for i in range(1000)]))      # chacun arrive pile quand le guichet se libère
tests.append(test([(1000 * i, 1) for i in range(1000)]))   # personne n'attend
for n, tmax, dmax in [(10, 100, 30), (1000, 1000000, 1000), (1000, 500000, 1000), (1000, 1000, 10)]:
    tests.append(test(random_clients(n, tmax, dmax)))
print(json.dumps(tests))
