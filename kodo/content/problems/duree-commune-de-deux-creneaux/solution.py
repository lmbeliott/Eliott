a, b = map(int, input().split())
c, d = map(int, input().split())

# La partie commune commence au plus tard des deux débuts...
debut = a
if c > a:
    debut = c

# ... et se termine au plus tôt des deux fins.
fin = b
if d < b:
    fin = d

if fin > debut:
    print(fin - debut)
else:
    print(0)
