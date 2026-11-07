import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
q = int(donnees[1])

# p[i] = somme des i premiers mouvements, p[0] = 0
p = [0] * (n + 1)
for i in range(1, n + 1):
    p[i] = p[i - 1] + int(donnees[1 + i])

reponses = []
k = 2 + n
for _ in range(q):
    l = int(donnees[k])
    r = int(donnees[k + 1])
    k = k + 2
    reponses.append(p[r] - p[l - 1])
print("\n".join(map(str, reponses)))
