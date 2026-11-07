n, k = map(int, input().split())
liste = list(map(int, input().split()))

# Un décalage de N ramène la liste à son point de départ.
k = k % n

# La case i de la liste décalée vient de la case (i + k) % n.
for i in range(n):
    print(liste[(i + k) % n], end=" ")
print()
