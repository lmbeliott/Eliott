import sys
from itertools import accumulate

def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    seuils = [int(x) for x in donnees[2:2 + n]]
    ajouts = []
    pos = 2 + n
    for _ in range(m):
        l, r, v = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        ajouts.append((l - 1, r, v))   # cases numérotées à partir de 0, fin exclue
        pos += 3

    def suffisant(k):
        # les k premiers ajouts suffisent-ils ? (tableau de différences)
        diff = [0] * (n + 1)
        for i in range(k):
            l, r, v = ajouts[i]
            diff[l] += v
            diff[r] -= v
        valeurs = accumulate(diff)
        return all(x >= s for x, s in zip(valeurs, seuils))

    if not suffisant(m):
        print(-1)
        return
    pas_assez = 0   # 0 ajout ne suffit jamais : les seuils sont au moins 1
    assez = m
    while assez - pas_assez > 1:
        milieu = (pas_assez + assez) // 2
        if suffisant(milieu):
            assez = milieu
        else:
            pas_assez = milieu
    print(assez)

main()
