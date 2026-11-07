s = input()
cpt = [0] * 26                   # cpt[k] : apparitions de la lettre de rang k
for c in s:
    c = c.lower()
    if "a" <= c <= "z":
        cpt[ord(c) - ord("a")] = cpt[ord(c) - ord("a")] + 1
k = 0
for i in range(26):
    if cpt[i] > cpt[k]:          # > strict : la première lettre en cas d'égalité
        k = i
print(chr(ord("a") + k), cpt[k])
