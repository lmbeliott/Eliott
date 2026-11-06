import json
tests = [
    "3 6\n",
    "4 34\n",
    "2 19\n",     # impossible : au plus 9 + 9 = 18
    "1 0\n",
    "1 9\n",
    "10 0\n",
    "10 90\n",
    "5 22\n",
    "8 30\n",
    "9 40\n",
    "10 45\n",
    "10 37\n",
    "10 52\n",
]
print(json.dumps(tests))
