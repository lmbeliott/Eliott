n, k = map(int, input().split())
valeurs = input().split()

deja_vus = {}     # valeur -> nombre de fois qu'elle est apparue avant la position courante
paires = 0
for i in range(n):
    x = int(valeurs[i])
    # chaque valeur k - x vue plus tôt forme une paire avec x
    paires = paires + deja_vus.get(k - x, 0)
    deja_vus[x] = deja_vus.get(x, 0) + 1
print(paires)
