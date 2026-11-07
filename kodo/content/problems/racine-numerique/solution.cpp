#include <iostream>
using namespace std;

long long somme_chiffres(long long n) {
    long long s = 0;
    while (n > 0) {
        s = s + n % 10;
        n = n / 10;
    }
    return s;
}

long long racine(long long n) {
    // On remplace n par la somme de ses chiffres tant qu'il a au moins deux chiffres.
    while (n >= 10) {
        n = somme_chiffres(n);
    }
    return n;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        cout << racine(n) << "\n";
    }
    return 0;
}
