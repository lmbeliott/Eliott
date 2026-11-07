#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string texte;
    cin >> texte;

    unordered_map<string, int> code;   // mot -> code
    for (int i = 0; i < 26; i++) {
        string lettre = "";
        lettre += (char)('a' + i);
        code[lettre] = i;
    }
    int suivant = 26;                  // prochain code libre

    vector<int> codes;
    string mot = texte.substr(0, 1);   // la première lettre
    for (int i = 1; i < (int)texte.size(); i++) {
        char c = texte[i];
        if (code.count(mot + c) > 0) {
            mot = mot + c;             // on prolonge le mot courant
        } else {
            codes.push_back(code[mot]);
            code[mot + c] = suivant;
            suivant = suivant + 1;
            mot = "";
            mot += c;                  // on repart de la lettre c
        }
    }
    codes.push_back(code[mot]);

    cout << codes.size() << "\n";
    for (int i = 0; i < (int)codes.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << codes[i];
    }
    cout << "\n";
    return 0;
}
