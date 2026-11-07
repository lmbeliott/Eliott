import sys
sys.setrecursionlimit(10000)

n, prefixe = input().split()
n = int(n)
mot = []
compte = 0
premier = ""

def fin_valable():
    # le mot ne finit-il par aucun bloc doublé ? (les autres ont déjà été vérifiés)
    k = len(mot)
    for l in range(1, k // 2 + 1):
        if mot[k - l:] == mot[k - 2 * l:k - l]:
            return False
    return True

def prolonger():
    global compte, premier
    if len(mot) == n:
        if compte == 0:
            premier = "".join(mot)     # les lettres sont essayées dans l'ordre : c'est le plus petit
        compte += 1
        return
    for lettre in "abc":
        mot.append(lettre)
        if fin_valable():
            prolonger()
        mot.pop()

valable = True
for lettre in prefixe:
    mot.append(lettre)
    if not fin_valable():
        valable = False
if valable:
    prolonger()
print(compte)
if compte > 0:
    print(premier)
