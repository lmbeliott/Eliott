# vrai si l'écriture de x en base b se lit pareil dans les deux sens
def palindrome_en_base(x, b):
    chiffres = []
    while x > 0:
        chiffres.append(x % b)
        x = x // b
    i = 0
    j = len(chiffres) - 1
    while i < j:
        if chiffres[i] != chiffres[j]:
            return False
        i += 1
        j -= 1
    return True


# palindromes décimaux de cette longueur, au plus n, palindromes en base b
def compter_longueur(longueur, n, b):
    total = 0
    h = (longueur + 1) // 2
    # on fabrique les palindromes à partir de leur première moitié, dans l'ordre croissant
    for moitie in range(10 ** (h - 1), 10 ** h):
        s = str(moitie)
        if longueur % 2 == 0:
            p = s + s[::-1]          # abc -> abccba
        else:
            p = s + s[:-1][::-1]     # abc -> abcba
        x = int(p)
        if x > n:
            return total             # les suivants de cette longueur sont plus grands
        if palindrome_en_base(x, b):
            total += 1
    return total


n, b = map(int, input().split())
total = 0
for longueur in range(1, len(str(n)) + 1):
    total += compter_longueur(longueur, n, b)
print(total)
