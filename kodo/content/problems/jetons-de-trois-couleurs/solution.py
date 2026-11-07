t = int(input())
for _ in range(t):
    r, v, b = map(int, input().split())
    reponse = -1
    # couleur d'arrivée : il faut vider les deux autres, de même reste modulo 3
    for x, y in [(r, v), (v, b), (r, b)]:
        if x % 3 == y % 3:
            if reponse == -1 or max(x, y) < reponse:
                reponse = max(x, y)
    print(reponse)
