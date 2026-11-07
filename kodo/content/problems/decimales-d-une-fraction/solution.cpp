#include <iostream>
using namespace std;

int main() {
    long long a, b;
    int k;
    cin >> a >> b >> k;
    cout << a / b << "\n";        // partie entière
    long long r = a % b;          // reste de la division posée
    for (int i = 0; i < k; i++) {
        r = r * 10;               // on abaisse un zéro
        cout << r / b;            // chiffre suivant, entre 0 et 9
        r = r % b;
    }
    cout << "\n";
    return 0;
}
