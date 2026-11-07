#include <iostream>
#include <string>
using namespace std;

int main() {
    string touches;
    cin >> touches;
    string pile;           // le texte : la dernière lettre est en haut de la pile
    for (char c : touches) {
        if (c == '<') {
            if (!pile.empty()) {
                pile.pop_back();
            }
        } else {
            pile.push_back(c);
        }
    }
    if (pile.empty()) {
        cout << "VIDE\n";
    } else {
        cout << pile << "\n";
    }
    return 0;
}
