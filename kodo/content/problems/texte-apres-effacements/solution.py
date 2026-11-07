touches = input()

pile = []                  # le texte : la dernière lettre est en haut de la pile
for c in touches:
    if c == "<":
        if len(pile) > 0:
            pile.pop()
    else:
        pile.append(c)

if len(pile) == 0:
    print("VIDE")
else:
    print("".join(pile))
