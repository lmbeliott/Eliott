n = int(input())
points = []
for i in range(n):
    x, y = map(int, input().split())
    points.append((x, y))
ensemble = set(points)        # pour tester très vite si un point existe

def est_present(x, y):
    return (x, y) in ensemble

nombre = 0
for (ax, ay) in points:
    for (bx, by) in points:
        if (ax, ay) != (bx, by):
            # le côté AB, tourné d'un quart de tour : (dx, dy) devient (-dy, dx)
            dx = bx - ax
            dy = by - ay
            if est_present(bx - dy, by + dx) and est_present(ax - dy, ay + dx):
                nombre = nombre + 1
# chaque carré a été trouvé une fois par côté, parcouru dans le sens direct
print(nombre // 4)
