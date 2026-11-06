k = int(input())
message = input()

decode = ""
for c in message:
    if c == " ":
        # Les espaces ne sont pas codés.
        decode = decode + " "
    else:
        # Position de la lettre dans l'alphabet (0 pour a, 25 pour z),
        # on recule de k places, et % 26 fait le tour de l'alphabet.
        position = (ord(c) - ord("a") - k) % 26
        decode = decode + chr(ord("a") + position)

print(decode)
