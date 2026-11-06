def chiffres(n):
    # 1352 -> [1, 3, 5, 2]
    liste = []
    while n > 0:
        liste.append(n % 10)
        n = n // 10
    liste.reverse()
    return liste


def est_montagne(n):
    c = chiffres(n)
    k = len(c)
    # On monte tant que les chiffres augmentent strictement.
    i = 0
    while i + 1 < k and c[i] < c[i + 1]:
        i += 1
    # Le sommet ne doit être ni le premier ni le dernier chiffre.
    if i == 0 or i == k - 1:
        return False
    # Puis on descend tant que les chiffres diminuent strictement.
    while i + 1 < k and c[i] > c[i + 1]:
        i += 1
    # C'est une montagne si la descente va jusqu'au dernier chiffre.
    return i == k - 1


a, b = map(int, input().split())
total = 0
for n in range(a, b + 1):
    if est_montagne(n):
        total += 1
print(total)
