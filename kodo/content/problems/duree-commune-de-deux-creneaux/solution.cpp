#include <iostream>
using namespace std;

int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;

    // La partie commune commence au plus tard des deux débuts...
    int debut = a;
    if (c > a) {
        debut = c;
    }

    // ... et se termine au plus tôt des deux fins.
    int fin = b;
    if (d < b) {
        fin = d;
    }

    if (fin > debut) {
        cout << fin - debut << "\n";
    } else {
        cout << 0 << "\n";
    }
    return 0;
}
