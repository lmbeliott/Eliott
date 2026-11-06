#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // Le plus petit temps gagne.
    if (a < b) {
        cout << "MIA\n";
    } else if (b < a) {
        cout << "THEO\n";
    } else {
        cout << "EGALITE\n";
    }
    return 0;
}
