n = int(input())
compte = 0
for i in range(n):
    k = i + 1
    par3 = k % 3 == 0
    par5 = k % 5 == 0
    # Exactement un des deux est vrai : les deux booléens sont différents.
    if par3 != par5:
        compte = compte + 1
print(compte)
