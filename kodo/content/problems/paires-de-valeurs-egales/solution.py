n = int(input())
t = list(map(int, input().split()))
cpt = [0] * 1001          # cpt[x] : apparitions de x déjà rencontrées
paires = 0
for x in t:
    paires = paires + cpt[x]   # x forme une paire avec chaque apparition précédente
    cpt[x] = cpt[x] + 1
print(paires)
