import sys

def somme_ecarts(v):
    # somme des |v[i] - v[j]| sur toutes les paires i < j
    v.sort()
    total = 0
    prefixe = 0          # v[0] + ... + v[k-1]
    for k in range(len(v)):
        total = total + k * v[k] - prefixe
        prefixe = prefixe + v[k]
    return total

donnees = sys.stdin.read().split()
n = int(donnees[0])
xs = [int(donnees[1 + 2 * i]) for i in range(n)]
ys = [int(donnees[2 + 2 * i]) for i in range(n)]
print(somme_ecarts(xs) + somme_ecarts(ys))
