#include <iostream>
#include <string>
using namespace std;

long long somme_diviseurs_propres(long long n) {
    long long s = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) {
            s = s + d;
            if (d * d != n) {        // l'autre diviseur de la paire, s'il est différent
                s = s + n / d;
            }
        }
    }
    return s - n;                    // n lui-même n'est pas un diviseur propre
}

string classer(long long n) {
    long long s = somme_diviseurs_propres(n);
    if (s == n) {
        return "PARFAIT";
    } else if (s > n) {
        return "ABONDANT";
    } else {
        return "DEFICIENT";
    }
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        cout << classer(n) << "\n";
    }
    return 0;
}
