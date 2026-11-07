n = int(input())
a = int(input())
b = int(input())
# premier >= second : les deux plus grandes valeurs vues jusqu'ici.
if a >= b:
    premier = a
    second = b
else:
    premier = b
    second = a
for i in range(n - 2):
    x = int(input())
    if x > premier:
        second = premier
        premier = x
    elif x > second:
        second = x
print(second)
