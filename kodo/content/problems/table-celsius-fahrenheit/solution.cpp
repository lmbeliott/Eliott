#include <iostream>
using namespace std;

int main() {
    // De -40 à 100 inclus, de 5 en 5. On multiplie par 9 avant de diviser par 5.
    for (int c = -40; c <= 100; c += 5) {
        cout << c << " " << c * 9 / 5 + 32 << "\n";
    }
    return 0;
}
