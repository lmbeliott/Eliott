#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n == 0) {
        // Le nombre 0 s'écrit avec un seul chiffre, qui est pair.
        cout << 1 << "\n";
    } else {
        int pairs = 0;
        while (n > 0) {
            int chiffre = n % 10;  // le dernier chiffre
            if (chiffre % 2 == 0) {
                pairs = pairs + 1;
            }
            n = n / 10;            // on enlève le dernier chiffre
        }
        cout << pairs << "\n";
    }
    return 0;
}
