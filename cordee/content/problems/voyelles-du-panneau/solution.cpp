#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot;
    cin >> mot;

    // On compte les lettres qui sont des voyelles.
    int voyelles = 0;
    for (char c : mot) {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') {
            voyelles++;
        }
    }

    cout << voyelles << "\n";
    // Toutes les autres lettres sont des consonnes.
    cout << (int)mot.size() - voyelles << "\n";
    return 0;
}
