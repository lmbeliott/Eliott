s = input()
priorite = {"+": 1, "-": 1, "*": 2}

valeurs = []     # pile des valeurs déjà calculées
ops = []         # pile des opérateurs et des parenthèses ouvrantes

def appliquer():
    o = ops.pop()
    b = valeurs.pop()          # second opérande
    a = valeurs.pop()          # premier opérande
    if o == "+":
        valeurs.append(a + b)
    elif o == "-":
        valeurs.append(a - b)
    else:
        valeurs.append(a * b)

i = 0
n = len(s)
while i < n:
    c = s[i]
    if c.isdigit():
        x = 0
        while i < n and s[i].isdigit():    # lire tous les chiffres du nombre
            x = 10 * x + int(s[i])
            i = i + 1
        valeurs.append(x)
        continue
    if c == "(":
        ops.append(c)
    elif c == ")":
        while ops[-1] != "(":
            appliquer()
        ops.pop()                          # retirer la parenthèse ouvrante
    else:
        # appliquer d'abord les opérateurs de priorité supérieure ou égale
        while len(ops) > 0 and ops[-1] != "(" and priorite[ops[-1]] >= priorite[c]:
            appliquer()
        ops.append(c)
    i = i + 1

while len(ops) > 0:
    appliquer()
print(valeurs[0])
