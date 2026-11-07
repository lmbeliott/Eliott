#include <iostream>
using namespace std;

int main() {
    int l1, c1, l2, c2;
    cin >> l1 >> c1 >> l2 >> c2;

    // Une case est noire quand la somme ligne + colonne est paire.
    if ((l1 + c1) % 2 == (l2 + c2) % 2) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
