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
        long long a1, m1, a2, m2;
        cin >> a1 >> m1 >> a2 >> m2;
        long long u, v;
        long long g = euclideEtendu(m1, m2, u, v);
        long long d = a2 - a1;
        if (d % g != 0) {
            cout << -1 << "\n";
            continue;
        }
        long long m = m2 / g;
        // (m1/g) × u ≡ 1 (mod m2/g) ; tout est ramené entre 0 et m - 1 avant de multiplier
        long long inverse = ((u % m) + m) % m;
        long long r = ((d / g) % m + m) % m;
        long long k = inverse * r % m;
        cout << a1 + m1 * k << "\n";
    }
    return 0;
}
