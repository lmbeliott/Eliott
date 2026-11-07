import sys

M = 1000000007
donnees = sys.stdin.read().split()
n = int(donnees[0])
a = [int(x) for x in donnees[1:n + 1]]

total = 0              # a1 + ... + aN, modulo M
produit = 1            # (1 + a1)(1 + a2)...(1 + aN), modulo M
for x in a:
    total = (total + x) % M
    produit = produit * (1 + x) % M

puissance = 1          # 2^(N-1) modulo M
for _ in range(n - 1):
    puissance = puissance * 2 % M

print(total * puissance % M)
print((produit - 1) % M)
