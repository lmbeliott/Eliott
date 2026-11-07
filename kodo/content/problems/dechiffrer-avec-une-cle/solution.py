def decaler(lettre, decalage):
    # recule la lettre de « decalage » rangs dans l'alphabet, en revenant à z après a
    rang = (ord(lettre) - ord("a") - decalage) % 26
    return chr(rang + ord("a"))

cle = input()
message = input()

clair = ""
k = 0                       # position dans la clé
for c in message:
    if c == " ":
        clair = clair + " "
    else:
        decalage = ord(cle[k % len(cle)]) - ord("a")
        clair = clair + decaler(c, decalage)
        k = k + 1           # seules les lettres consomment la clé
print(clair)
