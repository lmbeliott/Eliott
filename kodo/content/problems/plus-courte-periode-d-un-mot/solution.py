q = int(input())
for _ in range(q):
    mot = input().strip()
    n = len(mot)
    # On essaie les périodes p = 1, 2, 3… : la première qui marche est la plus courte.
    # p = n marche toujours, car il n'y a alors aucune lettre à comparer.
    p = 1
    while p < n:
        ok = True
        for i in range(n - p):
            if mot[i] != mot[i + p]:
                ok = False
                break
        if ok:
            break
        p = p + 1
    print(p, mot[:p])
