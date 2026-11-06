#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // Le plus petit temps gagne.
    if (a < b) {
        cout << 1 << "\n";
    } else if (b < a) {
        cout << 2 << "\n";
    } else {
        cout << "EGALITE\n";
    }
    return 0;
}
