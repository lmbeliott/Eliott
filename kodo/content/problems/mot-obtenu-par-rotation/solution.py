a = input()
b = input()
reponse = -1
for k in range(len(a)):
    if a[k:] + a[:k] == b:     # le mot tourné de k crans
        reponse = k
        break                  # on garde le plus petit k
print(reponse)
