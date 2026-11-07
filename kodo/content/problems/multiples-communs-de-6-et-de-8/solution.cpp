#include <iostream>
using namespace std;

int main() {
    // Les multiples communs de 6 et de 8 sont les multiples de 24.
    for (int i = 24; i < 500; i += 24) {
        cout << i << "\n";
    }
    return 0;
}
