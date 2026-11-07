h, p = map(int, input().split())
contacts = 1          # la première chute
distance = h
h = h * p // 100      # hauteur du premier rebond
while h > 0:
    distance = distance + 2 * h   # la balle monte puis redescend
    contacts = contacts + 1
    h = h * p // 100
print(contacts, distance)
