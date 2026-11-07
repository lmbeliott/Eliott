import sys
sys.setrecursionlimit(10000)

def evaluer(i):
    # valeur de l'expression qui commence au morceau i, et indice du morceau qui la suit
    t = morceaux[i]
    if t not in ("+", "-", "*"):
        return int(t), i + 1
    a, j = evaluer(i + 1)   # première opérande
    b, k = evaluer(j)       # seconde opérande
    if t == "+":
        return a + b, k
    if t == "-":
        return a - b, k
    return a * b, k

n = int(input())
morceaux = input().split()
valeur, fin = evaluer(0)
print(valeur)
