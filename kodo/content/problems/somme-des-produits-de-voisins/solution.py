n = int(input())
precedent = int(input())
somme = 0
# La première valeur est déjà lue : il en reste n - 1.
for i in range(n - 1):
    x = int(input())
    somme = somme + precedent * x
    precedent = x
print(somme)
