#include <iostream>
using namespace std;

int main() {
    int p = 1;
    for (int i = 0; i < 2026; i++) {
        // On multiplie par 7 et on ne garde que les quatre derniers chiffres.
        p = p * 7 % 10000;
    }
    cout << p << "\n";
    return 0;
}
