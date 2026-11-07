texte = input()

code = {}                      # mot -> code
for i in range(26):
    code[chr(ord("a") + i)] = i
suivant = 26                   # prochain code libre

codes = []
mot = texte[0]
for c in texte[1:]:
    if mot + c in code:
        mot = mot + c          # on prolonge le mot courant
    else:
        codes.append(code[mot])
        code[mot + c] = suivant
        suivant = suivant + 1
        mot = c                # on repart de la lettre c
codes.append(code[mot])

print(len(codes))
print(*codes)
