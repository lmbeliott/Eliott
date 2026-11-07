phrase = input()

# les lettres seules, en minuscules
t = []
for c in phrase:
    if c.isalpha():
        t.append(c.lower())

remplacements = 0
i = 0
j = len(t) - 1
while i < j:
    if t[i] != t[j]:
        remplacements = remplacements + 1   # un remplacement par paire différente
    i = i + 1
    j = j - 1
print(remplacements)
