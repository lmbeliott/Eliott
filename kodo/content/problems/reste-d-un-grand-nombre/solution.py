n = input()                  # le nombre reste une chaîne
m = int(input())
r = 0                        # reste par m du nombre formé par les chiffres déjà lus
for c in n:
    d = ord(c) - ord("0")
    r = (10 * r + d) % m
print(r)
