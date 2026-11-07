a, b, k = map(int, input().split())
# b // k : numéro du plus grand multiple de k qui ne dépasse pas b
# (a - 1) // k : numéro du plus grand multiple de k qui ne dépasse pas a - 1
print(b // k - (a - 1) // k)
