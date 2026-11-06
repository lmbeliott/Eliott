mot = input()

# On compte les lettres qui sont des voyelles.
voyelles = 0
for lettre in mot:
    if lettre in "aeiouy":
        voyelles += 1

print(voyelles)
# Toutes les autres lettres sont des consonnes.
print(len(mot) - voyelles)
