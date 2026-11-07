#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    for (int q = 0; q < t; q++) {
        long long m, a, b, x, k;
        cin >> m >> a >> b >> x >> k;
        // invariant : le résultat cherché est g appliquée k fois à x, avec g(y) = (a*y + b) % m
        while (k > 0) {
            if (k % 2 == 1) {
                x = (a * x + b) % m;       // appliquer g une fois
                k -= 1;
            }
            long long a2 = a * a % m;      // g devient g∘g
            long long b2 = (a * b + b) % m;
            a = a2;
            b = b2;
            k /= 2;
        }
        cout << x << "\n";
    }
    return 0;
}
