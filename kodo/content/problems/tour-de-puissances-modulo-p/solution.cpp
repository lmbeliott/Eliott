#include <iostream>
using namespace std;

const long long P = 1000000007;

// a^n mod m, par exponentiation rapide
long long puissance(long long a, long long n, long long m) {
    long long r = 1 % m;
    a = a % m;
    while (n > 0) {
        if (n % 2 == 1) {
            r = r * a % m;
        }
        a = a * a % m;
        n = n / 2;
    }
    return r;
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b, c;
        cin >> a >> b >> c;
        long long reponse;
        if (a % P == 0) {
            bool exposantNul = (b == 0 && c >= 1);
            reponse = exposantNul ? 1 : 0;
        } else {
            long long e = puissance(b, c, P - 1);   // Fermat : l'exposant compte modulo P - 1
            reponse = puissance(a, e, P);
        }
        cout << reponse << "\n";
    }
    return 0;
}
