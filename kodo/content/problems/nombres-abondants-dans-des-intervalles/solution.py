import sys

donnees = sys.stdin.read().split()
q = int(donnees[0])
questions = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(q)]
n = max(r for l, r in questions)

# s[m] = somme des diviseurs de m strictement plus petits que m
s = [0] * (n + 1)
for d in range(1, n // 2 + 1):
    for m in range(2 * d, n + 1, d):
        s[m] = s[m] + d

# c[m] = nombre d'abondants entre 1 et m
c = [0] * (n + 1)
for m in range(1, n + 1):
    c[m] = c[m - 1]
    if s[m] > m:
        c[m] = c[m] + 1

sortie = []
for l, r in questions:
    sortie.append(str(c[r] - c[l - 1]))
print("\n".join(sortie))
