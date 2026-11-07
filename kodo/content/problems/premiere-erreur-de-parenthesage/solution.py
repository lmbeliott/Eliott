s = input()
ouvrant_de = {")": "(", "]": "[", "}": "{"}

pile = []          # positions (à partir de 0) des ouvrants pas encore refermés
erreur = -1
for i in range(len(s)):
    c = s[i]
    if c == "(" or c == "[" or c == "{":
        pile.append(i)
    else:
        if len(pile) == 0 or s[pile[-1]] != ouvrant_de[c]:
            erreur = i
            break
        pile.pop()

if erreur >= 0:
    print(erreur + 1)
elif len(pile) > 0:
    print(pile[0] + 1)     # le plus à gauche est en bas de la pile
else:
    print("OUI")
