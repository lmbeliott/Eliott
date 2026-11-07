n = int(input())
mot = input()

vus = [0] * 26   # vus[r] : apparitions de la lettre de rang r avant la position courante
total = 0
for c in mot:
    r = ord(c) - ord("a")
    total = total + vus[r]   # un couple avec chaque apparition précédente
    vus[r] = vus[r] + 1
print(total)
