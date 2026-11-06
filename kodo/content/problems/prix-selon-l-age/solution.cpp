#include <iostream>
using namespace std;

int main() {
    int a;
    cin >> a;
    // On teste les tranches d'âge dans l'ordre : un seul cas est choisi.
    if (a < 4) {
        cout << 0 << "\n";
    } else if (a <= 11) {
        cout << 12 << "\n";
    } else if (a <= 17) {
        cout << 18 << "\n";
    } else if (a <= 64) {
        cout << 25 << "\n";
    } else {
        cout << 20 << "\n";
    }
    return 0;
}
