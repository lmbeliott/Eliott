n = int(input())
for i in range(1, n + 1):
    for j in range(n - i):          # les points de gauche
        print(".", end="")
    for j in range(2 * i - 1):      # les dièses
        print("#", end="")
    for j in range(n - i):          # les points de droite
        print(".", end="")
    print()
