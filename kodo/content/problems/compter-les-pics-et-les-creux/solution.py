n = int(input())
avant = int(input())
milieu = int(input())
pics = 0
creux = 0
for i in range(n - 2):
    apres = int(input())
    # On examine milieu, qui a maintenant ses deux voisins.
    if milieu > avant and milieu > apres:
        pics = pics + 1
    if milieu < avant and milieu < apres:
        creux = creux + 1
    avant = milieu
    milieu = apres
print(pics, creux)
