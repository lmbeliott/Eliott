k = int(input())
texte = input()

k26 = k % 26   # en Python, le reste est entre 0 et 25 même si k < 0
k10 = k % 10

morceaux = []
for c in texte:
    if "a" <= c <= "z":
        c = chr(ord("a") + (ord(c) - ord("a") + k26) % 26)
    elif "A" <= c <= "Z":
        c = chr(ord("A") + (ord(c) - ord("A") + k26) % 26)
    elif "0" <= c <= "9":
        c = chr(ord("0") + (ord(c) - ord("0") + k10) % 10)
    morceaux.append(c)
print("".join(morceaux))
