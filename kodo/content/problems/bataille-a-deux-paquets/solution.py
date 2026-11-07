from collections import deque

n = int(input())
p1 = deque(map(int, input().split()))   # du dessus (tête) vers le dessous (queue)
p2 = deque(map(int, input().split()))

tours = 0
while len(p1) > 0 and len(p2) > 0 and tours < 300000:
    a = p1.popleft()
    b = p2.popleft()
    if a > b:
        p1.append(a)      # sa propre carte d'abord, puis celle de l'adversaire
        p1.append(b)
    else:
        p2.append(b)
        p2.append(a)
    tours = tours + 1
print(tours, len(p1), len(p2))
