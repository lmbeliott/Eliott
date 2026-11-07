#include <iostream>
using namespace std;

// nombre de coups pour aller de (a, b) à (c, d), ou -1
long long coups(long long a, long long b, long long c, long long d) {
    long long total = 0;
    while (true) {
        if (c == a && d == b) {
            return total;
        }
        if (c < a || d < b || c == d) {
            return -1;
        }
        if (c > d) {
            if (d == b) {
                // le second nombre reste b : on passe par (a, b) seulement si c - a est un multiple de d
                if ((c - a) % d == 0) {
                    return total + (c - a) / d;
                }
                return -1;
            }
            long long q = (c - 1) / d;   // reculer d'un coup tant que c > d
            total += q;
            c -= q * d;
        } else {
            if (c == a) {
                if ((d - b) % c == 0) {
                    return total + (d - b) / c;
                }
                return -1;
            }
            long long q = (d - 1) / c;
            total += q;
            d -= q * c;
        }
    }
}

int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b, c, d;
        cin >> a >> b >> c >> d;
        cout << coups(a, b, c, d) << "\n";
    }
    return 0;
}
