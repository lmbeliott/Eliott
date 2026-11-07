#include <iostream>
using namespace std;

int main() {
    int a = 1;  // le terme à afficher
    int b = 1;  // le terme suivant
    for (int i = 0; i < 40; i++) {
        cout << a << "\n";
        // On avance d'un cran : on calcule le nouveau terme avant d'écraser a.
        int c = a + b;
        a = b;
        b = c;
    }
    return 0;
}
