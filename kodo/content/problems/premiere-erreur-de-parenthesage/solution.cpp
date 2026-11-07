#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<int> pile;      // positions (à partir de 0) des ouvrants pas encore refermés
    int erreur = -1;
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            pile.push_back(i);
        } else {
            char attendu = (c == ')') ? '(' : (c == ']') ? '[' : '{';
            if (pile.empty() || s[pile.back()] != attendu) {
                erreur = i;
                break;
            }
            pile.pop_back();
        }
    }
    if (erreur >= 0) {
        cout << erreur + 1 << "\n";
    } else if (!pile.empty()) {
        cout << pile[0] + 1 << "\n";   // le plus à gauche est en bas de la pile
    } else {
        cout << "OUI\n";
    }
    return 0;
}
