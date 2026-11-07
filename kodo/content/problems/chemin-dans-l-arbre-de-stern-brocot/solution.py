import sys

donnees = sys.stdin.read().split()
t = int(donnees[0])
sortie = []
for i in range(t):
    p, q = int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])
    blocs = []
    while p != q:
        if p > q:
            k = (p - 1) // q  # nombre de pas à droite : on retire q tant que p reste > q
            blocs.append(f"R {k}")
            p -= k * q
        else:
            k = (q - 1) // p  # nombre de pas à gauche
            blocs.append(f"L {k}")
            q -= k * p
    sortie.append(" ".join([str(len(blocs))] + blocs))
print("\n".join(sortie))
