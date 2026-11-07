n = int(input())
for i in range(n):
    for j in range(n):
        bord = i == 0 or i == n - 1 or j == 0 or j == n - 1
        diagonale = i == j or i + j == n - 1
        if bord or diagonale:
            print("#", end="")
        else:
            print(".", end="")
    print()
