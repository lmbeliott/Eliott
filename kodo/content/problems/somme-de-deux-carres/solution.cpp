#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // Premier passage : compter les couples (a, b) avec a <= b.
    int nombre = 0;
    long long a = 0;
    while (2 * a * a <= n) {
        long long b = a;
        while (a * a + b * b <= n) {
            if (a * a + b * b == n) {
                nombre = nombre + 1;
            }
            b = b + 1;
        }
        a = a + 1;
    }
    cout << nombre << "\n";

    // Second passage : les mêmes boucles, pour afficher les couples.
    a = 0;
    while (2 * a * a <= n) {
        long long b = a;            // b repart de a à chaque tour externe
        while (a * a + b * b <= n) {
            if (a * a + b * b == n) {
                cout << a << " " << b << "\n";
            }
            b = b + 1;
        }
        a = a + 1;
    }
    return 0;
}
