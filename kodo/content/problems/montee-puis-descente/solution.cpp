#include <iostream>
using namespace std;

int main() {
    // La montée : de 1 à 25 inclus.
    for (int i = 1; i <= 25; i++) {
        cout << i << "\n";
    }
    // La descente commence à 24 : le sommet est déjà affiché.
    for (int i = 24; i >= 1; i--) {
        cout << i << "\n";
    }
    cout << "FIN" << "\n";
    return 0;
}
