elements = input().split()

pile = []
erreur = False
for e in elements:
    if e == "+" or e == "-" or e == "*":
        if len(pile) < 2:
            erreur = True
            break
        b = pile.pop()       # le haut de la pile est le second opérande
        a = pile.pop()
        if e == "+":
            pile.append(a + b)
        elif e == "-":
            pile.append(a - b)
        else:
            pile.append(a * b)
    else:
        pile.append(int(e))

if erreur or len(pile) != 1:
    print("ERREUR")
else:
    print(pile[0])
