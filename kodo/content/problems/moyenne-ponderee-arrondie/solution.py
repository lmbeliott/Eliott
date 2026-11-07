def arrondi_au_dixieme(total, coefs):
    # plus proche entier de 10 × total / coefs, les demis vers le haut,
    # calculé uniquement avec des entiers
    return (20 * total + coefs) // (2 * coefs)

n = int(input())
total = 0
coefs = 0
for i in range(n):
    note, coef = map(int, input().split())
    total = total + note * coef
    coefs = coefs + coef

dixiemes = arrondi_au_dixieme(total, coefs)
print(str(dixiemes // 10) + "." + str(dixiemes % 10))
