n = int(input())
score = 0
manques = 0
for i in range(n):
    x, y = map(int, input().split())
    d = x * x + y * y            # carré de la distance au centre
    if d <= 10 * 10:
        score = score + 10
    elif d <= 20 * 20:
        score = score + 8
    elif d <= 30 * 30:
        score = score + 6
    elif d <= 40 * 40:
        score = score + 4
    elif d <= 50 * 50:
        score = score + 2
    else:
        manques = manques + 1
print(score, manques)
