#include <cctype>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    getline(cin, s);                 // la ligne contient des espaces
    vector<int> cpt(26, 0);          // cpt[k] : apparitions de la lettre de rang k
    for (char c : s) {
        c = tolower(c);
        if (c >= 'a' && c <= 'z') {
            cpt[c - 'a'] = cpt[c - 'a'] + 1;
        }
    }
    int k = 0;
    for (int i = 0; i < 26; i++) {
        if (cpt[i] > cpt[k]) {       // > strict : la première lettre en cas d'égalité
            k = i;
        }
    }
    cout << (char) ('a' + k) << " " << cpt[k] << "\n";
    return 0;
}
