import sys
from functools import cmp_to_key

def avant(a, b):
    # a = (D_a, F_a), b = (D_b, F_b) : faut-il traiter a avant b ?
    # on compare D_a / F_a et D_b / F_b sans division : D_a * F_b et D_b * F_a
    return a[0] * b[1] - b[0] * a[1]

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    taches = []
    for i in range(n):
        taches.append((int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])))

    taches.sort(key=cmp_to_key(avant))
    temps = 0
    attente = 0
    for duree, personnes in taches:
        temps += duree                 # la tâche se termine à ce moment
        attente += personnes * temps   # chacune de ses personnes a attendu `temps` minutes
    print(attente)

main()
