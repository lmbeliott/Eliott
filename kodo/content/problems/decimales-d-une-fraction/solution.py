a, b, k = map(int, input().split())
print(a // b)               # partie entière
r = a % b                   # reste de la division posée
for i in range(k):
    r = r * 10              # on abaisse un zéro
    print(r // b, end="")   # chiffre suivant, entre 0 et 9
    r = r % b
print()
