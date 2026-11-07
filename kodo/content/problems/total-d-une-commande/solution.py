n = int(input())
prix = {}
for i in range(n):
    nom, p = input().split()
    prix[nom] = int(p)          # un nouveau prix remplace l'ancien

m = int(input())
total = 0
inconnus = 0
for i in range(m):
    nom, q = input().split()
    if nom in prix:
        total = total + prix[nom] * int(q)
    else:
        inconnus = inconnus + 1
print(total)
print(inconnus)
