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
        long long a, b, m;
        cin >> a >> b >> m;
        long long u, v;
        long long g = euclideEtendu(a, m, u, v);
        if (b % g != 0) {
            cout << -1 << "\n";
            continue;
        }
        long long m2 = m / g;
        // (a/g) × u ≡ 1 (mod m/g) ; on ramène u entre 0 et m2 - 1 avant de multiplier
        long long inverse = ((u % m2) + m2) % m2;
        long long x = inverse * ((b / g) % m2) % m2;
        cout << x << " " << g << "\n";
    }
    return 0;
}
