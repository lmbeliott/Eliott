#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    // Les marmottes sortent à partir de 8 degrés (8 compris).
    if (t >= 8) {
        cout << "SORTIE\n";
    } else {
        cout << "TERRIER\n";
    }
    return 0;
}
