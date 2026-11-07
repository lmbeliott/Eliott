from functools import cmp_to_key

def compare(a, b):
    # a doit passer avant b si a + b > b + a
    if a + b > b + a:
        return -1
    if a + b < b + a:
        return 1
    return 0

n = int(input())
mots = input().split()
mots.sort(key=cmp_to_key(compare))
resultat = "".join(mots)
if resultat[0] == "0":      # que des zéros
    resultat = "0"
print(resultat)
