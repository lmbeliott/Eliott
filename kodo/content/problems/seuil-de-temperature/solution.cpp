#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    // Au moins 8 degrés : 8 est compris.
    if (t >= 8) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
