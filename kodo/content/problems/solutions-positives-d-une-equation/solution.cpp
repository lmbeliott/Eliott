#include <iostream>
using namespace std;

// renvoie g = PGCD(a, b) et remplit u, v avec a × u + b × v = g
long long euclideEtendu(long long a, long long b, long long& u, long long& v) {
    if (b == 0) {
        u = 1;
        v = 0;
        return a;
    }
    long long u1, v1;
    long long g = euclideEtendu(b, a % b, u1, v1);
    u = v1;
    v = u1 - (a / b) * v1;
    return g;
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b, c;
        cin >> a >> b >> c;
        long long u, v;
        long long g = euclideEtendu(a, b, u, v);
        if (c % g != 0) {
            cout << 0 << "\n";
            continue;
        }
        long long b2 = b / g;
        // (a/g) × u ≡ 1 (mod b/g) ; plus petit x possible, sans dépasser 10^18
        long long inverse = ((u % b2) + b2) % b2;
        long long x0 = inverse * ((c / g) % b2) % b2;
        if (a * x0 > c) {
            cout << 0 << "\n";
        } else {
            cout << (c - a * x0) / (a * b2) + 1 << "\n";
        }
    }
    return 0;
}
