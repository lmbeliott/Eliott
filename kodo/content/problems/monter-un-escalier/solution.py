n = int(input())
# a, b, c : nombres de façons pour i - 3, i - 2 et i - 1 marches
a = 0       # W(-2)
b = 0       # W(-1)
c = 1       # W(0) : la montée vide
for i in range(1, n + 1):
    nouveau = a + b + c     # dernier pas de 3, de 2 ou de 1 marche
    a = b
    b = c
    c = nouveau
print(c)
