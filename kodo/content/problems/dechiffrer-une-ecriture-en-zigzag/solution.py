k = int(input())
chiffre = input()
n = len(chiffre)
k = min(k, n)   # les lignes au-delà de la n-ième restent vides


def ligne(i):
    """Ligne (à partir de 0) sur laquelle tombe la lettre d'indice i."""
    if k == 1:
        return 0
    periode = 2 * k - 2
    r = i % periode
    if r < k:
        return r          # on descend
    return periode - r    # on remonte


# premier passage : nombre de lettres sur chaque ligne
longueur = [0] * k
for i in range(n):
    longueur[ligne(i)] += 1

# début de chaque ligne dans le message chiffré
debut = [0] * k
for r in range(1, k):
    debut[r] = debut[r - 1] + longueur[r - 1]

# second passage : chaque indice prend la prochaine lettre de sa ligne
message = []
for i in range(n):
    r = ligne(i)
    message.append(chiffre[debut[r]])
    debut[r] += 1
print("".join(message))
