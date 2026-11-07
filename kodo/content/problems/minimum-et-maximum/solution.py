n = int(input())
# Le minimum et le maximum partent de la première valeur.
mini = int(input())
maxi = mini
for i in range(n - 1):
    x = int(input())
    if x < mini:
        mini = x
    if x > maxi:
        maxi = x
print(mini, maxi)
