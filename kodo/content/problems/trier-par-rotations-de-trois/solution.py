import sys

def triable(a):
    n = len(a)
    if n <= 2:
        return n < 2 or a[0] <= a[1]
    if len(set(a)) < n:               # deux valeurs égales : toujours possible
        return True
    # place[i] = rang de a[i] dans la liste triée
    ordre = sorted(range(n), key=lambda i: a[i])
    place = [0] * n
    for rang in range(n):
        place[ordre[rang]] = rang
    # nombre de cycles de la permutation
    vu = [False] * n
    cycles = 0
    for i in range(n):
        if not vu[i]:
            cycles = cycles + 1
            j = i
            while not vu[j]:
                vu[j] = True
                j = place[j]
    return (n - cycles) % 2 == 0      # nombre pair d'inversions

donnees = sys.stdin.read().split()
t = int(donnees[0])
pos = 1
for _ in range(t):
    n = int(donnees[pos])
    a = [int(x) for x in donnees[pos + 1:pos + 1 + n]]
    pos = pos + 1 + n
    print("OUI" if triable(a) else "NON")
