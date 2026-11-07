n = int(input())
p = list(map(int, input().split()))

mini = p[0]              # plus petit prix avant le jour courant
meilleur = p[1] - p[0]   # meilleur gain d'une revente avant le jour courant
for j in range(1, n):
    # invariant : mini = min(p[0..j-1])
    meilleur = max(meilleur, p[j] - mini)
    mini = min(mini, p[j])
print(meilleur)
