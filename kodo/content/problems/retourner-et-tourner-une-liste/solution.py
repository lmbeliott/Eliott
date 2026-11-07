def retourner(t, i, j):
    # Renverse t[i..j] en place : la liste de l'appelant est modifiée.
    while i < j:
        x = t[i]
        t[i] = t[j]
        t[j] = x
        i = i + 1
        j = j - 1


def tourner(t, k):
    # Trois retournements : les k premiers, les n - k derniers, puis tout.
    n = len(t)
    retourner(t, 0, k - 1)
    retourner(t, k, n - 1)
    retourner(t, 0, n - 1)


n, q = map(int, input().split())
t = list(map(int, input().split()))
for i in range(q):
    morceaux = input().split()
    if morceaux[0] == "R":
        retourner(t, int(morceaux[1]) - 1, int(morceaux[2]) - 1)
    else:
        tourner(t, int(morceaux[1]))
print(*t)
