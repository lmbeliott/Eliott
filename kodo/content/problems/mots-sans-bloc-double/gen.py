import json
tests = ["5 a\n", "7 cac\n", "1 b\n", "4 abab\n", "3 aa\n", "30 a\n", "30 b\n", "29 c\n", "30 abc\n",
         "30 abacabcacbabcabacabcacbacabacb\n", "30 abcacbabcbac\n", "25 bcab\n", "20 cabacbcab\n",
         "30 abacaba\n", "12 abcbacbcabcb\n", "30 abacbc\n"]
print(json.dumps(tests))
