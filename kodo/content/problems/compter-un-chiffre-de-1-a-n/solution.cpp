#include <iostream>
using namespace std;

// nombre d'apparitions du chiffre c dans l'écriture de 1, 2, ..., n
long long compter(long long n, int c) {
    long long total = 0;
    long long p = 1;
    while (p <= n) {
        long long haut = n / p / 10;   // n / (10p) sans calculer 10p, qui peut déborder
        long long d = (n / p) % 10;
        long long bas = n % p;
        if (c == 0) {
            if (haut >= 1) {
                total += (haut - 1) * p;               // parties hautes de 1 à haut - 1
                total += (d > 0) ? p : bas + 1;
            }
        } else {
            total += haut * p;                         // parties hautes de 0 à haut - 1
            if (c < d) total += p;
            else if (c == d) total += bas + 1;
        }
        if (p > n / 10) break;                         // p * 10 dépasserait n
        p = p * 10;
    }
    return total;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        int c;
        cin >> n >> c;
        cout << compter(n, c) << "\n";
    }
    return 0;
}
