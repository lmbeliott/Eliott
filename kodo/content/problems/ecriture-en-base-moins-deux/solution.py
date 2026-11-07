t = int(input())
for _ in range(t):
    n = int(input())
    if n == 0:
        print(0)
    else:
        chiffres = []
        # invariant : N = (valeur des chiffres rangés) + (-2)^len(chiffres) × n
        while n != 0:
            r = n % 2            # 0 ou 1, même si n < 0
            chiffres.append(str(r))
            n = (n - r) // (-2)  # division exacte
        print("".join(chiffres[::-1]))
