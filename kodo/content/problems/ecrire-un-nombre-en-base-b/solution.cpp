#include <iostream>
using namespace std;

int main() {
    long long n, b;
    cin >> n >> b;

    // 1. La plus grande puissance de B qui ne dépasse pas N, et le nombre de chiffres.
    long long p = 1;
    int k = 1;
    while (p * b <= n) {
        p = p * b;
        k = k + 1;
    }
    cout << k << "\n";

    // 2. Les chiffres, de gauche à droite.
    while (p > 0) {
        cout << n / p << "\n";
        n = n % p;
        p = p / b;
    }
    return 0;
}
