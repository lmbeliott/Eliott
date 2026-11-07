#include <iostream>
using namespace std;

int main() {
    // De 150 à 0 inclus, en reculant de 5.
    for (int i = 150; i >= 0; i -= 5) {
        cout << i << "\n";
    }
    // Une seule fois, après la boucle.
    cout << "ZERO" << "\n";
    return 0;
}
